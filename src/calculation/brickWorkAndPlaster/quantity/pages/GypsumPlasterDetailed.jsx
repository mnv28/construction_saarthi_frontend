import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import InputsTable from '../components/InputsTable';
import OutputsTable from '../components/OutputsTable';

const GypsumPlasterDetailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation('calculation');
    const { calculationData, outputs } = location.state || { calculationData: [], outputs: [] };

    return (
        <div className="min-h-screen max-w-7xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8 group pt-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1 cursor-pointer">
                        <ArrowLeft className="w-6 h-6 text-primary" />
                    </button>
                    <h1 className="text-xl font-bold text-primary">
                        {t('brickWorkAndPlaster.gypsumPlaster.detailedTitle')}
                    </h1>
                </div>
            </div>

            <div className="space-y-4">
                <InputsTable
                    title={t('steel.weight.inputs')}
                    data={calculationData}
                />

                <OutputsTable
                    title={t('steel.weight.outputs')}
                    outputs={outputs}
                />
            </div>
        </div>
    );
};

export default GypsumPlasterDetailed;
