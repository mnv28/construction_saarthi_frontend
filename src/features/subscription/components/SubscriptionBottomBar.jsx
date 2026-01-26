/**
 * Subscription Bottom Bar Component
 * Fixed bottom bar with plan summary and action buttons
 */

import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import { useSubscriptions } from '../hooks';

export default function SubscriptionBottomBar({
  selectedPlan = null,
  calculationPrice = 0,
  onCancel,
  onContinue,
}) {
  const { t } = useTranslation('subscription');
  const { planSummary, purchasedPlan } = useSubscriptions();

  // Get data from planSummary or fallback to selectedPlan/defaults
  const apiPlan = planSummary?.plan;
  const payableAmount = apiPlan?.payable_amount ?? selectedPlan?.price ?? 0;
  const planName = apiPlan?.plan_name || selectedPlan?.name || purchasedPlan?.name || t('availablePlans.plans.monthly');
  const planPeriod = selectedPlan?.period || purchasedPlan?.billing_period || t('availablePlans.plans.periodMonth');

  // Format description
  const description = apiPlan?.description || selectedPlan?.description || purchasedPlan?.description || t('availablePlans.plans.description');

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Plan Summary */}
        <div className="">
          <p className="text-base md:text-[22px] font-medium text-primary">
            ₹{Number(payableAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-sm text-primary-light"> /{planPeriod}</span>
          </p>
          <p className="text-xs md:text-sm text-primary-light">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCancel}
            className="!px-12 !py-3 rounded-xl border border-[#060C121A] !bg-white !text-primary hover:!bg-gray-50"
          >
            {t("bottomBar.cancel", { defaultValue: "Cancel" })}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleContinue}
            className="!px-12 !py-3 rounded-xl"
          >
            {t("bottomBar.continue", { defaultValue: "Continue" })}
          </Button>
        </div>
      </div>
    </div>

  );
}

