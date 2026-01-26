import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import Loader from '../../../components/ui/Loader';

import calculatorIcon from '../../../assets/icons/CalculatorMinimalistic.svg';
import QuickActions from '../components/QuickActions';
import CalculationSummary from '../components/CalculationSummary';
import { ROUTES_FLAT } from '../../../constants/routes';

/* ---------------- MOCK DATA ---------------- */

const MOCK_PROJECT = {
    id: '1',
    name: 'Construction Calculation',
};

export default function ProjectCalDetails() {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();
    const isLoading = false;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-7xl mx-auto px-0">
                <div className="mb-6">
                    <PageHeader
                        title={MOCK_PROJECT.name}
                        showBackButton
                        backTo="/dashboard"
                    >
                        <div
                            className=""
                        >
                            <button
                                className="flex items-center gap-2 text-accent font-medium cursor-pointer"
                                onClick={() => navigate(ROUTES_FLAT.CALCULATION_HISTORY)}
                            >
                                <History className="w-5 h-5 text-accent" />
                                <span>{t('projectDetails.history')}</span>
                            </button>
                        </div>
                    </PageHeader>
                </div>

                {/* Shared Stats & Buy Component */}
                <CalculationSummary onBuyClick={() => console.log('Buy click')} />

                {/* Quick Actions Section */}
                <div className=" p-1 mb-8">
                    <QuickActions />
                </div>
            </div>
        </div>
    );
}
