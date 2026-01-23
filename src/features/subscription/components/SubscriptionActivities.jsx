import { useTranslation } from 'react-i18next';
import { useSubscriptions } from '../hooks';
import Loader from '../../../components/ui/Loader';

export default function SubscriptionActivities() {
    const { t } = useTranslation('subscription');
    const { purchasedPlan, planSummary, isLoadingSummary } = useSubscriptions();

    // Format data or fallback to defaults
    const activities = {
        members: {
            purchased: planSummary?.members?.purchased ?? purchasedPlan?.total_members_purchased ?? 0,
            used: planSummary?.members?.used ?? purchasedPlan?.total_members_used ?? 0,
        },
        calculations: {
            purchased: planSummary?.calculations?.purchased ?? purchasedPlan?.total_calculations_purchased ?? 0,
            used: planSummary?.calculations?.used ?? purchasedPlan?.total_calculations_used ?? 0,
        }
    };

    if (isLoadingSummary && !planSummary) {
        return (
            <div className="flex justify-center p-8 bg-[#F9F4EE] rounded-2xl border border-[#E7D7C1] mb-6">
                <Loader size="sm" />
            </div>
        );
    }

    return (
        <section className="mb-6">
            <div className="bg-[#F9F4EE] rounded-2xl border border-[#E7D7C1] px-4 py-5">
                <h2 className="text-base md:text-lg font-medium text-primary mb-2">
                    {t('activities.title', { defaultValue: 'Your Activities' })}
                </h2>
                <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                    {/* Members Card */}
                    <div className="bg-white rounded-xl p-4 flex-1">
                        <h3 className="text-accent text-base font-medium mb-1">
                            {t('activities.members', { defaultValue: 'Members' })}
                        </h3>
                        <div className="">
                            <div className="flex justify-between items-center">
                                <span className="text-primary-light text-sm">
                                    {t('activities.purchasedMembers', { defaultValue: 'Purchased Members:' })}
                                </span>
                                <span className="text-primary font-bold">
                                    {activities.members.purchased}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm md:text-base">
                                <span className="text-primary-light text-sm">
                                    {t('activities.memberUsed', { defaultValue: 'Member Used:' })}
                                </span>
                                <span className="text-primary font-bold">
                                    {activities.members.used}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Calculations Card */}
                    <div className="bg-white rounded-xl p-4 flex-1">
                        <h3 className="text-accent text-base font-medium">
                            {t('activities.calculations', { defaultValue: 'Calculations' })}
                        </h3>
                        <div className="">
                            <div className="flex justify-between items-center text-sm md:text-base">
                                <span className="text-primary-light text-sm">
                                    {t('activities.purchasedCalculations', { defaultValue: 'Purchased Calculations:' })}
                                </span>
                                <span className="text-primary font-bold">
                                    {activities.calculations.purchased}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm md:text-base">
                                <span className="text-primary-light text-sm">
                                    {t('activities.calculationUsed', { defaultValue: 'Calculation Used:' })}
                                </span>
                                <span className="text-primary font-bold">
                                    {activities.calculations.used}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
