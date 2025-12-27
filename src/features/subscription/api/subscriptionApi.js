/**
 * Subscription API
 * API calls for subscription features
 */

import http from '../../../services/http';
import { SUBSCRIPTION_ENDPOINTS_FLAT } from '../constants/subscriptionEndpoints';

/**
 * Get available plans (benefits list)
 * @returns {Promise<Array>} List of available plan benefits
 */
export const getAvailablePlans = async () => {
  try {
    const response = await http.get(SUBSCRIPTION_ENDPOINTS_FLAT.AVAILABLE_PLANS);
    
    // Handle different response structures
    if (Array.isArray(response)) {
      return response;
    }
    
    // Check for features property (API returns { features: [...] })
    if (response?.features && Array.isArray(response.features)) {
      return response.features;
    }
    
    // Fallback to other possible structures
    return response?.data || response?.plans || [];
  } catch (error) {
    console.error('Get available plans error:', error);
    throw error;
  }
};

/**
 * Get subscription plans
 * @returns {Promise<Array>} List of subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    const response = await http.get(SUBSCRIPTION_ENDPOINTS_FLAT.GET_SUBSCRIPTION_PLANS);
    
    // Handle different response structures
    if (Array.isArray(response)) {
      return response;
    }
    
    return response?.data || response?.plans || [];
  } catch (error) {
    console.error('Get subscription plans error:', error);
    throw error;
  }
};

/**
 * Get eligible coupons for a subscription plan
 * @param {string|number} subscriptionPlanId - Subscription plan ID
 * @returns {Promise<Array>} List of eligible coupons
 */
export const getEligibleCoupons = async (subscriptionPlanId) => {
  if (!subscriptionPlanId) {
    throw new Error('Subscription plan ID is required');
  }

  try {
    const response = await http.get(
      `${SUBSCRIPTION_ENDPOINTS_FLAT.ELIGIBLE_COUPONS}/${subscriptionPlanId}`
    );
    
    // Handle different response structures
    if (Array.isArray(response)) {
      return response;
    }
    
    return response?.data || response?.coupons || [];
  } catch (error) {
    console.error('Get eligible coupons error:', error);
    throw error;
  }
};

/**
 * Prepare subscription for payment
 * @param {Object} payload - Prepare subscription payload
 * @param {number} payload.subscription_plan_id - Subscription plan ID
 * @param {number} payload.total_main_users - Total main users
 * @param {number} payload.total_sub_users - Total sub users
 * @param {number} payload.total_calculation_required - Total calculations required
 * @param {number} [payload.coupon_id] - Optional coupon ID
 * @returns {Promise<Object>} Prepare response with redis_key and payable_amount
 */
export const prepareSubscription = async (payload) => {
  if (!payload.subscription_plan_id) {
    throw new Error('Subscription plan ID is required');
  }

  try {
    const response = await http.post(SUBSCRIPTION_ENDPOINTS_FLAT.PREPARE_SUBSCRIPTION, payload);
    return response?.data || response;
  } catch (error) {
    console.error('Prepare subscription error:', error);
    throw error;
  }
};

/**
 * Create payment order
 * @param {Object} payload - Create order payload
 * @param {string} payload.redis_key - Redis key from prepare subscription
 * @returns {Promise<Object>} Payment order response with key_id, order, and payment_id
 */
export const createPaymentOrder = async (payload) => {
  if (!payload.redis_key) {
    throw new Error('Redis key is required');
  }

  try {
    const response = await http.post(SUBSCRIPTION_ENDPOINTS_FLAT.CREATE_PAYMENT_ORDER, payload);
    return response?.data || response;
  } catch (error) {
    console.error('Create payment order error:', error);
    throw error;
  }
};

/**
 * Verify payment
 * @param {Object} payload - Payment verification payload
 * @param {string} payload.razorpay_payment_id - Razorpay payment ID
 * @param {string} payload.razorpay_order_id - Razorpay order ID
 * @param {string} payload.razorpay_signature - Razorpay signature
 * @returns {Promise<Object>} Verification response
 */
export const verifyPayment = async (payload) => {
  if (!payload.razorpay_payment_id || !payload.razorpay_order_id || !payload.razorpay_signature) {
    throw new Error('Payment verification data is required');
  }

  try {
    const response = await http.post(SUBSCRIPTION_ENDPOINTS_FLAT.VERIFY_PAYMENT, payload);
    return response?.data || response;
  } catch (error) {
    console.error('Verify payment error:', error);
    throw error;
  }
};

/**
 * Report payment failure
 * @param {Object} payload - Payment failure payload
 * @param {string} payload.razorpay_order_id - Razorpay order ID
 * @param {string} payload.error_description - Error description
 * @returns {Promise<Object>} Failure response
 */
export const reportPaymentFailure = async (payload) => {
  if (!payload.razorpay_order_id) {
    throw new Error('Order ID is required');
  }

  try {
    const response = await http.post(SUBSCRIPTION_ENDPOINTS_FLAT.PAYMENT_FAILURE, payload);
    return response?.data || response;
  } catch (error) {
    console.error('Report payment failure error:', error);
    throw error;
  }
};

