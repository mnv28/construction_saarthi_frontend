import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAvailablePlans, getSubscriptionPlans, getSubscriptionSummaryWithPlan } from '../api/subscriptionApi';

const SubscriptionContext = createContext(null);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);
  const [error, setError] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isLoadingAvailablePlans, setIsLoadingAvailablePlans] = useState(true);
  const [purchasedPlan, setPurchasedPlan] = useState(null);
  const [planSummary, setPlanSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [userRegistrationDate, setUserRegistrationDate] = useState(null);
  const [totalDaysSinceRegistration, setTotalDaysSinceRegistration] = useState(0);

  // Fetch subscription plans (used by AvailablePlans and AddOns)
  const fetchSubscriptionPlans = useCallback(async () => {
    try {
      setIsLoadingSubscriptions(true);
      const res = await getSubscriptionPlans();

      // The API returns { success, message, data, userPurchasedPlanId, hasActiveSubscription, ... }
      const plansData = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

      setHasActiveSubscription(!!res?.hasActiveSubscription);
      setUserRegistrationDate(res?.user_registrationDate || null);
      setTotalDaysSinceRegistration(res?.user_totalDaysSinceRegistration || 0);

      // Filter active and non-deleted plans
      const activePlans = plansData.filter(plan => {
        if (!plan) return false;
        if (plan.is_active === false) return false;
        if (plan.is_deleted === true) return false;
        return true;
      });

      setSubscriptions(activePlans);

      // Find purchased plan
      const purchased = plansData.find(plan => plan.isPurchased === true);
      setPurchasedPlan(purchased || null);

      setError(null);
      return activePlans;
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError(err);
      setSubscriptions([]);
      setPurchasedPlan(null);
      return [];
    } finally {
      setIsLoadingSubscriptions(false);
    }
  }, []);

  // Fetch plan summary (usage stats)
  const fetchPlanSummary = useCallback(async (planId) => {
    if (!planId) return;
    try {
      setIsLoadingSummary(true);
      const res = await getSubscriptionSummaryWithPlan(planId);
      setPlanSummary(res);
      return res;
    } catch (err) {
      console.error('Error fetching plan summary:', err);
      return null;
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  // Auto-fetch summary when purchased plan changes
  useEffect(() => {
    if (purchasedPlan?.id) {
      fetchPlanSummary(purchasedPlan.id);
    } else {
      setPlanSummary(null);
    }
  }, [purchasedPlan?.id, fetchPlanSummary]);

  // Fetch available plans/benefits (used by AvailablePlans)
  const fetchAvailablePlans = useCallback(async () => {
    try {
      setIsLoadingAvailablePlans(true);
      const response = await getAvailablePlans();

      // Ensure response is an array
      const benefitsData = Array.isArray(response) ? response : [];

      // Filter active and non-deleted benefits
      const activeBenefits = benefitsData.filter(item => {
        if (!item || !item.description) return false;
        if (item.is_active === false) return false;
        if (item.is_deleted === true) return false;
        return true;
      });

      setAvailablePlans(activeBenefits);
      setError(null);
      return activeBenefits;
    } catch (err) {
      console.error('Error fetching available plans:', err);
      setError(err);
      setAvailablePlans([]);
      return [];
    } finally {
      setIsLoadingAvailablePlans(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      await Promise.all([
        fetchSubscriptionPlans(),
        fetchAvailablePlans()
      ]);
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchSubscriptionPlans, fetchAvailablePlans]);

  const refetch = useCallback(async () => {
    await Promise.all([
      fetchSubscriptionPlans(),
      fetchAvailablePlans()
    ]);
  }, [fetchSubscriptionPlans, fetchAvailablePlans]);

  const value = {
    subscriptions,
    availablePlans,
    purchasedPlan,
    planSummary,
    hasActiveSubscription,
    userRegistrationDate,
    totalDaysSinceRegistration,
    isLoadingSubscriptions,
    isLoadingAvailablePlans,
    isLoadingSummary,
    error,
    refetch,
    fetchSubscriptionPlans,
    fetchAvailablePlans,
    fetchPlanSummary,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

