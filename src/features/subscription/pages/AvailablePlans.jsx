import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import { useSubscriptions } from '../hooks';
import Loader from '../../../components/ui/Loader';

import { SubscriptionProvider } from '../context/SubscriptionContext';

function AvailablePlansContent() {
    const { t } = useTranslation('subscription');
    const navigate = useNavigate();
    const { subscriptions, isLoadingSubscriptions } = useSubscriptions();
    const [selectedPlanId, setSelectedPlanId] = useState('yearly');

    // Process plans for display
    const processedPlans = useMemo(() => {
        if (!subscriptions || subscriptions.length === 0) return [];

        return subscriptions.map((plan, index) => {
            const planName = (plan.name || '').toLowerCase();

            let planId;
            if (planName.includes('12 month') || planName.includes('yearly')) {
                planId = 'yearly';
            } else if (planName.includes('3 month')) {
                planId = '3month';
            } else if (planName.includes('6 month')) {
                planId = '6month';
            } else {
                planId = plan.id;
            }

            // Mocking badges based on plan data to match design
            let badge = null;
            if (planId === 'yearly') badge = { text: 'Best Value', color: 'bg-[#22C55E]' };
            else if (planId === '6month') badge = { text: 'Save ₹850', color: 'bg-[#FF9500]' };
            else if (planId === '3month') badge = { text: 'Save ₹650', color: 'bg-[#FF9500]' };
            else if (index === 0) badge = { text: 'Save ₹450', color: 'bg-[#FF9500]' };

            return {
                ...plan,
                displayId: planId,
                badge,
                description: t('availablePlans.plans.description', { defaultValue: 'Contractor + 3 Free Users' }),
            };
        }).sort((a, b) => {
            // Sort as per standard order
            const order = ['monthly', '3month', '6month', 'yearly'];
            const aIndex = order.indexOf(a.displayId);
            const bIndex = order.indexOf(b.displayId);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            return a.price - b.price;
        });
    }, [subscriptions, t]);

    const handlePlanSelect = (id) => {
        setSelectedPlanId(id);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-7xl mx-auto px-0 md:px-4">
            <PageHeader
                title={t('availablePlans.title', { defaultValue: 'Available Plans' })}
                onBack={handleBack}
            />

            {isLoadingSubscriptions ? (
                <div className="flex items-center justify-center py-20">
                    <Loader size="lg" />
                </div>
            ) : (
                <div className="space-y-4">
                    {processedPlans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => handlePlanSelect(plan.id)}
                            className={`relative rounded-2xl border transition-all cursor-pointer p-4 md:p-6 mb-2 ${selectedPlanId === plan.id
                                ? 'border-[#B3330E] bg-[#F9F4EE]'
                                : 'border-[#060C120F] bg-white'
                                }`}
                        >
                            {plan.badge && (
                                <div className={`absolute top-0 right-34 px-4 py-1 rounded-b-xl text-white text-[11px] md:text-sm font-medium ${plan.badge.color} shadow-sm z-10`}>
                                    {plan.badge.text}
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlanId === plan.id
                                        ? 'border-[#B3330E]'
                                        : 'border-[#060C1233]'
                                        }`}>
                                        {selectedPlanId === plan.id && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#B3330E]" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-semibold text-primary">
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs md:text-sm text-[#060C1280] mt-0.5">
                                            {plan.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-lg md:text-xl font-bold text-[#B3330E]">
                                        ₹{plan.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AvailablePlans() {
    return (
        <SubscriptionProvider>
            <AvailablePlansContent />
        </SubscriptionProvider>
    );
}
