import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import calculatorIcon from '../../../assets/icons/CalculatorMinimalistic.svg';
import { getMembersCalculationsSummary } from '../../../features/subscription/api/subscriptionApi';
import { ROUTES_FLAT } from '../../../constants/routes';

const CalculationSummary = ({ onBuyClick, showBuyButton = true }) => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            setIsLoading(true);
            const response = await getMembersCalculationsSummary();
            setSummaryData(response);
        } catch (error) {
            console.error("Error fetching calculation summary:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        {
            id: 1,
            label: t('projectDetails.totalCalculations'),
            value: summaryData?.TotalCalculations ?? 0,
        },
        {
            id: 2,
            label: t('projectDetails.usedCalculations'),
            value: summaryData?.UsedCalculations ?? 0,
        },
    ];

    return (
        <div className={`grid gap-4 mb-8 ${showBuyButton ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {/* Calculation Cards */}
            {isLoading ? (
                // Loading Skeletons
                [1, 2].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 h-[84px] animate-pulse">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <div className="h-6 bg-gray-100 rounded w-1/4" />
                            <div className="h-4 bg-gray-100 rounded w-1/2" />
                        </div>
                    </div>
                ))
            ) : (
                stats.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl shadow-sm relative overflow-hidden flex items-center gap-4 border border-[#060C120A]"
                    >
                        {/* Ribbon */}
                        <div className="absolute -right-6 top-1 rotate-45 bg-[#D34526] h-2 w-24" />
                        <div className="absolute -right-6 top-6 rotate-45 bg-[#D34526] h-2 w-24" />

                        {/* Icon */}
                        <div className="w-12 h-12 bg-[#FDF6F3] border border-[#E7D7C1] rounded-xl flex items-center justify-center flex-shrink-0">
                            <img
                                src={calculatorIcon}
                                alt="Calculator"
                                className="w-7 h-7"
                            />
                        </div>

                        {/* Text */}
                        <div>
                            <h3 className="text-2xl font-bold text-primary">
                                {item.value}
                            </h3>
                            <p className="text-xs sm:text-sm text-secondary truncate">
                                {item.label}
                            </p>
                        </div>
                    </div>
                ))
            )}

            {/* Buy Calculations Card (3rd position) */}
            {showBuyButton && (
                <button
                    onClick={() => {
                        if (onBuyClick) onBuyClick();
                        navigate(ROUTES_FLAT.SUBSCRIPTION);
                    }}
                    className="bg-[#FDF6F3] hover:bg-[#faefe9] active:bg-[#f8e8e0] transition-colors rounded-2xl p-4 flex items-center gap-4 text-left group cursor-pointer border border-[#E7D7C1] h-[84px]"
                >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Plus className="w-6 h-6 text-white" />
                    </div>

                    <div>
                        <p className="text-lg font-bold text-accent leading-tight">
                            {t('projectDetails.buyCalculations')}
                        </p>
                    </div>
                </button>
            )}
        </div>
    );
};

export default CalculationSummary;
