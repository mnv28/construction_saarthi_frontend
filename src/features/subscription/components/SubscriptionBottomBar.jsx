/**
 * Subscription Bottom Bar Component
 * Fixed bottom bar with plan summary and action buttons
 */

import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';

export default function SubscriptionBottomBar({ 
  selectedPlan = null,
  onCancel,
  onContinue,
}) {
  const { t } = useTranslation('subscription');

  // Default plan if none selected
  const plan = selectedPlan || {
    name: 'Monthly',
    price: 999,
    period: 'Month',
    description: 'Contractor + 3 Free Users',
  };

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
    <div className="flex-1 min-w-0">
      <p className="text-base md:text-[22px] font-medium text-primary">
        ₹{plan.price.toLocaleString()}
        <span className="text-sm text-primary-light"> /{plan.period} </span>
      </p>
      <p className="text-xs md:text-sm text-primary-light">
        {plan.description}
      </p>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 md:flex-row flex-col w-full md:w-auto">
      <Button
        variant="secondary"
        size="md"
        onClick={handleCancel}
        className="w-full md:w-[100px]"
      >
        {t("bottomBar.cancel", { defaultValue: "Cancel" })}
      </Button>

      <Button
        variant="primary"
        size="md"
        onClick={handleContinue}
        className="w-full md:w-[100px]"
      >
        {t("bottomBar.continue", { defaultValue: "Continue" })}
      </Button>
    </div>

  </div>
</div>

  );
}

