import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '../hooks';
import dayjs from 'dayjs';

export default function CurrentPlan() {
  const { t } = useTranslation('subscription');
  const { purchasedPlan, hasActiveSubscription, totalDaysSinceRegistration, userRegistrationDate } = useSubscriptions();

  // Assuming 15 days trial
  const trialDays = 15;
  const daysLeft = Math.max(0, trialDays - (totalDaysSinceRegistration || 0));
  const trialEndDate = userRegistrationDate
    ? dayjs(userRegistrationDate).add(trialDays, 'day').format('DD MMM YYYY')
    : dayjs().add(daysLeft, 'day').format('DD MMM YYYY');

  // Use dynamic billing period from the plan if available, default to 30 days
  const billingPeriod = purchasedPlan?.billing_period ? parseInt(purchasedPlan.billing_period) : 30;

  const nextBillingDate = purchasedPlan?.purchasedDate
    ? dayjs(purchasedPlan.purchasedDate).add(billingPeriod, 'day').format('DD MMM YYYY')
    : trialEndDate;

  const planName = hasActiveSubscription && purchasedPlan
    ? purchasedPlan.name
    : t('currentPlan.freeTrial', { defaultValue: 'Free Trial' });

  // Use plan description or default trial description
  const planSubtitle = hasActiveSubscription && purchasedPlan
    ? (purchasedPlan.description || t('currentPlan.plans.description', { defaultValue: 'Contractor + 3 Free Users' }))
    : t('currentPlan.trialSubtitle', { defaultValue: 'Contractor + 3 Free Users' });

  const price = hasActiveSubscription && purchasedPlan
    ? (purchasedPlan.price || purchasedPlan.purchasedPrice || 0)
    : 0;

  return (
    <section className="mb-6">
      <h2 className="text-base md:text-lg font-medium text-primary mb-3">
        {t('currentPlan.title', { defaultValue: 'Your Current Plan' })}
      </h2>

      <div className="bg-[#F6F6F6CC] rounded-2xl border border-[#E7D7C1] px-4 py-4.5">
        {/* Top Section: Plan Details & Price */}
        <div className="flex items-center justify-between gap-4 border-b border-[#060C120F] pb-4">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Radio Indicator */}
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full border border-[#B3330E] flex items-center justify-center bg-white shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B3330E]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-semibold text-primary leading-tight">
                {planName}
              </p>
              <p className="text-[#060C1280] mt-1 text-sm">
                {planSubtitle}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <p className="text-[18px] font-medium text-[#B3330E]">
              ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Bottom Section: Billing Info */}
        <div className="pt-3">
          <p className="text-[#060C1280] text-xs md:text-sm">
            {hasActiveSubscription
              ? `Your next billing date: ${nextBillingDate}`
              : daysLeft > 0
                ? `${daysLeft} Days left in Free Trial. Next billing date: ${trialEndDate}`
                : `Trial expired. Next billing date: ${trialEndDate}`}
          </p>
        </div>
      </div>
    </section>
  );
}



