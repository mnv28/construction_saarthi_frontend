/**
 * Subscription Page
 * Displays subscription plans and current subscription status
 * Uses feature API + shared UI components
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import Loader from '../../../components/ui/Loader';
import Button from '../../../components/ui/Button';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { useSubscriptions } from '../hooks';
import { prepareSubscription, createPaymentOrder, verifyPayment, reportPaymentFailure } from '../api/subscriptionApi';
import { showLoading, updateToast, showError, showSuccess } from '../../../utils/toast';
import {
  CurrentPlan,
  AvailablePlans,
  AddOns,
  OffersRewards,
  SubscriptionBottomBar,
} from '../components';
import { ROUTES_FLAT } from '../../../constants/routes';

function SubscriptionContent() {
  const { t } = useTranslation('subscription');
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoadingSubscriptions } = useSubscriptions();
  const [selectedPlanId, setSelectedPlanId] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanData, setSelectedPlanData] = useState(null); // Full plan data including apiId
  const [appliedCoupon, setAppliedCoupon] = useState(
    location.state?.appliedCoupon || null
  );
  const [totalMainUsers, setTotalMainUsers] = useState(5); // Default values
  const [totalSubUsers, setTotalSubUsers] = useState(10);
  const [totalCalculationRequired, setTotalCalculationRequired] = useState(25); // Default 25
  const [calculationPrice, setCalculationPrice] = useState(0); // Price for calculations addon

  useEffect(() => {
    if (location.state?.appliedCoupon) {
      setAppliedCoupon(location.state.appliedCoupon);
    }
  }, [location.state?.appliedCoupon]);

  const handleViewWallet = () => {
    navigate(ROUTES_FLAT.REFER_EARN_WALLET);
  };

  const handlePlanSelect = useCallback((planId, planData) => {
    setSelectedPlanId(planId);
    if (planData) {
      // Store full plan data for API calls
      setSelectedPlanData(planData);
      // Convert plan data to format expected by SubscriptionBottomBar
      setSelectedPlan({
        name: planData.name,
        price: planData.price,
        period: planId === 'yearly' ? 'Year' : planId === '3years' ? '3 Years' : 'Month',
        description: planData.description,
      });
    }
  }, []); // Empty dependency array - callback is stable

  const handleCancel = () => {
    // TODO: Handle cancel action
    console.log('Cancel clicked');
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleContinue = useCallback(async () => {
    if (!selectedPlanData || !selectedPlanData.apiId) {
      showError('Please select a subscription plan');
      return;
    }

    const toastId = showLoading('Preparing subscription...');
    
    try {
      // Step 1: Prepare subscription
      const preparePayload = {
        subscription_plan_id: Number(selectedPlanData.apiId),
        total_main_users: totalMainUsers,
        total_sub_users: totalSubUsers,
        total_calculation_required: totalCalculationRequired,
      };

      // Add coupon_id if coupon is applied
      if (appliedCoupon?.id) {
        preparePayload.coupon_id = Number(appliedCoupon.id);
      }

      const prepareResponse = await prepareSubscription(preparePayload);
      
      if (!prepareResponse?.redis_key) {
        throw new Error('Failed to prepare subscription: No redis_key received');
      }

      updateToast(toastId, { type: 'success', message: 'Subscription prepared successfully' });

      // Step 2: Create payment order
      const orderToastId = showLoading('Creating payment order...');
      
      const orderResponse = await createPaymentOrder({
        redis_key: prepareResponse.redis_key,
      });

      if (!orderResponse?.success || !orderResponse?.key_id || !orderResponse?.order) {
        throw new Error('Failed to create payment order');
      }

      updateToast(orderToastId, { type: 'success', message: 'Payment order created successfully' });

      // Step 3: Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Step 4: Open Razorpay payment modal
      // Get amount from prepareResponse (payable_amount in rupees) - convert to paise
      const amountInPaise = prepareResponse.payable_amount 
        ? Math.round(prepareResponse.payable_amount * 100) // Convert rupees to paise
        : 0;

      if (!amountInPaise) {
        throw new Error('Invalid payment amount');
      }

      const options = {
        key: orderResponse.key_id,
        amount: amountInPaise,
        currency: orderResponse.order.currency || 'INR',
        order_id: orderResponse.order.id,
        name: 'Construction Saarthi',
        description: `Subscription: ${selectedPlan?.name || 'Plan'}`,
        prefill: {
          // You can add user details here if available
        },
        theme: {
          color: '#B3330E', // Your brand color
        },
        handler: async function (response) {
          // Payment successful - verify payment
          const verifyToastId = showLoading('Verifying payment...');
          try {
            const verifyResponse = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            updateToast(verifyToastId, { type: 'success', message: 'Payment verified successfully' });
            showSuccess('Payment successful! Your subscription is now active.');
            
            // TODO: Refresh subscription data or navigate to success page
            // You may want to refetch subscription data here
            console.log('Payment verified:', verifyResponse);
          } catch (error) {
            console.error('Payment verification error:', error);
            updateToast(verifyToastId, { 
              type: 'error', 
              message: error?.response?.data?.message || error?.message || 'Payment verification failed' 
            });
          }
        },
        modal: {
          ondismiss: async function () {
            // User closed the payment modal
            try {
              await reportPaymentFailure({
                razorpay_order_id: orderResponse.order.id,
                error_description: 'User cancelled payment',
              });
            } catch (error) {
              console.error('Failed to report payment failure:', error);
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Subscription flow error:', error);
      updateToast(toastId, { 
        type: 'error', 
        message: error?.response?.data?.message || error?.message || 'Failed to process subscription' 
      });
    }
  }, [selectedPlanData, totalMainUsers, totalSubUsers, totalCalculationRequired, appliedCoupon, selectedPlan, loadRazorpayScript]);

  // Default plan if none selected
  const displayPlan = selectedPlan || {
    name: t('availablePlans.plans.yearly', { defaultValue: 'Yearly' }),
    price: 3999,
    period: 'Year',
    description: t('availablePlans.plans.description', { defaultValue: 'Contractor + 3 Free Users' }),
  };

  return (

      <div className="max-w-7xl mx-auto px-0 md:px-4">
        <PageHeader 
          title={t('header.title', { defaultValue: 'My Subscription' })}
          showBackButton={false}
        >
          <div className="flex justify-start md:justify-end">
            <Button
              variant="primary"
              size="sm"
              className="whitespace-nowrap rounded-lg px-4 py-2"
              onClick={handleViewWallet}
            >
              {t('header.viewWallet', { defaultValue: 'View My Wallet' })}
            </Button>
          </div>
        </PageHeader>

        {isLoadingSubscriptions ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            <CurrentPlan />
            <AvailablePlans 
              selectedPlanId={selectedPlanId}
              onPlanSelect={handlePlanSelect}
            />
            <AddOns 
              onCalculationChange={(quantity) => {
                setTotalCalculationRequired(quantity);
                // Calculate price: (quantity - 25) * 10, minimum 0
                setCalculationPrice(Math.max(0, (quantity - 25) * 10));
              }}
              onUsersChange={(mainUsers, subUsers) => {
                setTotalMainUsers(mainUsers);
                setTotalSubUsers(subUsers);
              }}
            />
            <OffersRewards appliedCoupon={appliedCoupon} />
            
            {/* Bottom Bar - Inside Page Content */}
            <SubscriptionBottomBar
              selectedPlan={displayPlan}
              calculationPrice={calculationPrice}
              onCancel={handleCancel}
              onContinue={handleContinue}
            />
          </div>
        )}
      </div>
  );
}

export default function Subscription() {
  return (
    <SubscriptionProvider>
      <SubscriptionContent />
    </SubscriptionProvider>
  );
}
