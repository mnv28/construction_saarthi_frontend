import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import InputsTable from '../components/InputsTable';
import OutputsTable from '../components/OutputsTable';

const ClayBrickDetailed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation('calculation');

    const data = location.state || {};
    const {
        calculationData = [],
        outputs = [],
        date,
        time,
        history = false
    } = data;

    return (
        <div className="min-h-screen max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 group pt-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1 cursor-pointer">
                        <ArrowLeft className="w-6 h-6 text-primary" />
                    </button>
                    <h1 className="text-xl font-bold text-primary">
                        {history ? t('brickWorkAndPlaster.clayBrick.title') : t('brickWorkAndPlaster.clayBrick.detailedTitle')}
                    </h1>
                </div>
            </div>

            <div className="mt-8">
                <InputsTable
                    title={t('steel.weight.inputs')}
                    data={calculationData}
                />
            </div>

            <OutputsTable
                title={t('steel.weight.outputs')}
                outputs={outputs}
            />
        </div>
    );
};

export default ClayBrickDetailed;
