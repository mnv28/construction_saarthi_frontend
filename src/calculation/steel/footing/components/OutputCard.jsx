import React from 'react';
import { useTranslation } from 'react-i18next';

const OutputCard = ({ title, formula, value, titleKey }) => {
    const { t } = useTranslation('calculation');
    const displayTitle = titleKey ? t(titleKey) : title;
    return (
        <div className="mb-6 rounded-3xl border border-[#060C120F] bg-white md:p-6 p-3">
            <h3 className="font-medium text-primary border-b border-[#060C120A] pb-3 mb-4">
                {displayTitle}
            </h3>
            <div className="space-y-">
                <div className="flex items-center gap-1">
                    <span className="text-primary text-sm md:min-w-[100px]">{t('steel.weight.formula')}:</span>
                    <p className="text-primary md:text-base text-sm font-medium break-all leading-relaxed">
                        {formula}
                    </p>
                </div>
                <div className="pt-1">
                    <p className=" flex items-baseline gap-2">
                        <span className="text-sm text-primary min-w-0 md:min-w-[100px]">{displayTitle} =</span>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OutputCard;
