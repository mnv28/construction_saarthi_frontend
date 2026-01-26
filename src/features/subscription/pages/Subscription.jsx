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
  SubscriptionActivities,
  AddOns,
  OffersRewards,
  SubscriptionBottomBar,
  AvailablePlans,
} from '../components';
import { ChevronRight } from 'lucide-react';
import { ROUTES_FLAT } from '../../../constants/routes';

function SubscriptionContent() {
  const { t } = useTranslation('subscription');
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoadingSubscriptions, hasActiveSubscription, purchasedPlan, refetch } = useSubscriptions();
  const [selectedPlanId, setSelectedPlanId] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanData, setSelectedPlanData] = useState(null); // Full plan data including apiId
  const [appliedCoupon, setAppliedCoupon] = useState(
    location.state?.appliedCoupon || null
  );
  const [totalMainUsers, setTotalMainUsers] = useState(1); // Default values
  const [totalSubUsers, setTotalSubUsers] = useState(0);
  const [totalCalculationRequired, setTotalCalculationRequired] = useState(0);
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
        period: planId === 'yearly' ? t('availablePlans.plans.yearly') : planId === '3years' ? t('availablePlans.plans.3years') : t('availablePlans.plans.periodMonth'),
        description: planData.description,
      });
    }
  }, [t]); // Empty dependency array - callback is stable

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
    // Use selected plan apiId or fallback to purchased plan id
    const planId = selectedPlanData?.apiId || purchasedPlan?.id;

    if (!planId) {
      showError(t('messages.selectPlanError'));
      return;
    }

    const toastId = showLoading(t('messages.preparingSubscription'));

    try {
      // Step 1: Prepare subscription
      const preparePayload = {
        subscription_plan_id: Number(planId),
        // These can be dynamically set based on what changed, 
        // but often the backend handles add-ons from previous sync calls
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

      updateToast(toastId, { type: 'success', message: t('messages.subscriptionPrepared') });

      // Step 2: Create payment order
      const orderToastId = showLoading(t('messages.creatingOrder'));

      const orderResponse = await createPaymentOrder({
        redis_key: prepareResponse.redis_key,
      });

      if (!orderResponse?.success || !orderResponse?.key_id || !orderResponse?.order) {
        throw new Error('Failed to create payment order');
      }

      updateToast(orderToastId, { type: 'success', message: t('messages.orderCreated') });

      // Step 3: Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error(t('messages.razorpayLoadError'));
      }

      // Step 4: Open Razorpay payment modal
      // Get amount from prepareResponse (payable_amount in rupees) - convert to paise
      const amountInPaise = prepareResponse.payable_amount
        ? Math.round(prepareResponse.payable_amount * 100) // Convert rupees to paise
        : 0;

      if (!amountInPaise) {
        throw new Error(t('messages.invalidAmountError'));
      }

      const options = {
        key: orderResponse.key_id,
        amount: amountInPaise,
        currency: orderResponse.order.currency || 'INR',
        order_id: orderResponse.order.id,
        name: 'Construction Saarthi',
        description: `${t('header.title')}: ${selectedPlan?.name || 'Plan'}`,
        prefill: {
          // You can add user details here if available
        },
        theme: {
          color: '#B3330E', // Your brand color
        },
        handler: async function (response) {
          // Payment successful - verify payment
          const verifyToastId = showLoading(t('messages.verifyingPayment'));
          try {
            const verifyResponse = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            updateToast(verifyToastId, { type: 'success', message: t('messages.paymentVerified') });
            showSuccess(t('messages.paymentSuccessful'));

            // Refresh subscription data to show active status
            refetch();
            console.log('Payment verified:', verifyResponse);
          } catch (error) {
            console.error('Payment verification error:', error);
            updateToast(verifyToastId, {
              type: 'error',
              message: error?.response?.data?.message || error?.message || t('messages.generalError')
            });
            // Still refetch to ensure state is clean
            refetch();
          }
        },
        modal: {
          ondismiss: async function () {
            // User closed the payment modal
            try {
              await reportPaymentFailure({
                razorpay_order_id: orderResponse.order.id,
                error_description: t('messages.paymentCancelled'),
              });
            } catch (error) {
              console.error('Failed to report payment failure:', error);
            } finally {
              // Refresh page data regardless of failure outcome
              refetch();
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
        message: error?.response?.data?.message || error?.message || t('messages.generalError')
      });
    }
  }, [selectedPlanData, purchasedPlan, totalMainUsers, totalSubUsers, totalCalculationRequired, appliedCoupon, selectedPlan, loadRazorpayScript, refetch, t]);

  // Default plan if none selected
  const displayPlan = selectedPlan || {
    name: t('availablePlans.plans.yearly'),
    price: 3999,
    period: t('availablePlans.plans.yearly'),
    description: t('availablePlans.plans.description'),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={t('header.title')}
        showBackButton={false}
      >
        <div className="flex justify-start md:justify-end">
          <Button
            variant="primary"
            size="sm"
            className="whitespace-nowrap rounded-lg px-4 py-2"
            onClick={handleViewWallet}
          >
            {t('header.viewWallet')}
          </Button>
        </div>
      </PageHeader>

      {isLoadingSubscriptions ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Plan Status Section */}
          {!hasActiveSubscription ? (
            <div className="bg-[#F6F6F6CC] rounded-2xl border border-[#E7D7C1] px-4 py-4.5">
              <h2 className="text-base md:text-lg font-medium text-primary mb-3">
                {t('currentPlan.title')}
              </h2>
              <div className="bg-white rounded-xl border border-dashed border-[#E7D7C1] p-6 text-center">
                <p className="text-primary font-medium text-lg">
                  {t('currentPlan.noActivePlan')}
                </p>
                <p className="text-[#060C1280] text-sm mt-1">
                  {t('currentPlan.selectPlanBelow')}
                </p>
              </div>
            </div>
          ) : (
            <CurrentPlan />
          )}

          {/* Usage Activities - Always show, defaults to 0 if inactive */}
          <SubscriptionActivities />

          {/* Add-ons - Always show */}
          <AddOns
            onCalculationChange={(quantity) => {
              setTotalCalculationRequired(quantity);
            }}
            onUsersChange={(mainUsers, subUsers) => {
              setTotalMainUsers(mainUsers);
              setTotalSubUsers(subUsers);
            }}
          />

          {/* View Plans / Available Plans Selection */}
          {!hasActiveSubscription ? (
            <AvailablePlans
              selectedPlanId={selectedPlanId}
              onPlanSelect={handlePlanSelect}
            />
          ) : (
            <button
              onClick={() => navigate(ROUTES_FLAT.SUBSCRIPTION_AVAILABLE_PLANS)}
              className="w-full bg-[#F9F4EE] rounded-2xl border cursor-pointer border-[#060C120F] p-4 md:p-5 flex items-center justify-between group transition-colors hover:bg-[#F2E8DB]"
            >
              <span className="font-medium text-primary">
                {t('availablePlans.viewAll')}
              </span>
              <ChevronRight className="w-5 h-5 text-[#060C124D] group-hover:text-primary" />
            </button>
          )}

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
