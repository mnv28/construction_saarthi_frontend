import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import PageHeader from '../../../../components/layout/PageHeader';
import Button from '../../../../components/ui/Button';
import InputsTable from '../components/InputsTable';
import OutputsTable from '../components/OutputsTable';

const ColumnType10Detailed = () => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();
    const location = useLocation();
    const { calculationData = [], outputs = [] } = location.state || {}; // Get data from state

    // If no data, redirect back (optional safety)
    if (!calculationData.length && !outputs.length) {
        // You might want to useEffect to navigate back if data is missing
        // or just show empty state.
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto pb-20">
            <div className="mb-6">
                <PageHeader
                    title={t('steel.column.type10Detailed')}
                    showBackButton
                    onBack={() => navigate(-1)}
                />
            </div>

            <div className="space-y-6">
                {/* Inputs Table */}
                <InputsTable data={calculationData} />

                {/* Outputs Table */}
                <OutputsTable outputs={outputs} title="Outputs" />
            </div>
        </div>
    );
};

export default ColumnType10Detailed;
