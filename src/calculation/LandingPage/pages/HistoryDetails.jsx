import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Share2, Download, FileText, TrendingUp, Activity, AlertTriangle, Lightbulb } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';
import Button from '../../../components/ui/Button';
import CalculationTable from '../components/CalculationTable';
import Loader from '../../../components/ui/Loader';
import { getCalculationDetails } from '../../../features/projects/api/projectApi';
import { showError } from '../../../utils/toast';

const HistoryDetails = () => {
    const { t } = useTranslation('calculation');
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [calculationResult, setCalculationResult] = useState(null);
    const [calcTitle, setCalcTitle] = useState('');

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id]);

    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getCalculationDetails(id);
            if (response?.generated_content) {
                setCalculationResult(response.generated_content);
                setCalcTitle(response.promptDetail?.title || 'Calculation Details');
            }
        } catch (error) {
            console.error("Error fetching calculation details:", error);
            showError("Failed to load details");
        } finally {
            setIsLoading(false);
        }
    };

    const formatLabel = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' Inr', '').replace(' Nos', '').replace(' Ton', '').replace(' Bags', '').replace(' Liter', '').replace(' Kg', '').replace(' Sqft', '');
    };

    const getMaterialData = () => {
        if (!calculationResult?.calculation?.material_quantity) return [];
        return Object.entries(calculationResult.calculation.material_quantity).map(([key, value]) => ({
            material: formatLabel(key),
            quantity: value.toLocaleString(),
            unit: key.split('_').pop().charAt(0).toUpperCase() + key.split('_').pop().slice(1)
        }));
    };

    const getWorkCostData = () => {
        if (!calculationResult?.calculation?.work_cost_breakdown) return [];
        return Object.entries(calculationResult.calculation.work_cost_breakdown).map(([key, value]) => ({
            work: formatLabel(key),
            amount: `₹${value.toLocaleString()}`,
        }));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-vh-100 gap-4 py-20">
                <Loader size="lg" />
                <p className="text-secondary font-medium animate-pulse">Loading detailed report...</p>
            </div>
        );
    }

    if (!calculationResult) {
        return (
            <div className="text-center py-20">
                <p className="text-secondary">No data found for this calculation.</p>
                <Button onClick={() => window.history.back()} variant="secondary" className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto pb-10">
            <div className="mb-6">
                <PageHeader
                    title={calcTitle}
                    showBackButton
                    onBack={() => window.history.back()}
                >
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => console.log('Share')}
                            className="bg-white rounded-xl text-secondary !px-4 py-2"
                            leftIcon={<Share2 className="w-4 h-4 text-secondary" />}
                        >
                            <span className="text-sm font-medium">{t('history.sharePdf')}</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => console.log('Download')}
                            className="bg-white border-[#E0E0E0] rounded-xl text-secondary !px-4 py-2"
                            leftIcon={<Download className="w-4 h-4 text-secondary" />}
                        >
                            <span className="text-sm font-medium">{t('history.downloadReport')}</span>
                        </Button>
                    </div>
                </PageHeader>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-10 mt-8">
                {/* AI Insights Section */}
                {calculationResult.ai_insights && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Engineer Summary, Budget Health, Risk Observations */}
                        <div className="space-y-6">
                            {/* Engineer Summary */}
                            <div className="bg-white p-6 rounded-3xl border border-[#F0F0F0] shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-primary">Engineer Summary</h4>
                                </div>
                                <p className="text-secondary text-sm leading-relaxed whitespace-pre-line">
                                    {calculationResult.ai_insights.engineer_summary}
                                </p>
                            </div>

                            {/* Budget Health */}
                            <div className="bg-white p-6 rounded-3xl border border-[#F0F0F0] shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-primary">Budget Health</h4>
                                </div>
                                <p className="text-secondary text-sm leading-relaxed">
                                    {calculationResult.ai_insights.budget_health}
                                </p>
                            </div>

                            {/* Risk Observations */}
                            <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-red-900">Risk Observations</h4>
                                </div>
                                <ul className="space-y-3">
                                    {calculationResult.ai_insights.risk_observations?.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-red-800/80">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Major Cost Drivers, Practical Suggestions */}
                        <div className="space-y-6">
                            {/* Major Cost Drivers */}
                            <div className="bg-white p-6 rounded-3xl border border-[#F0F0F0] shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-primary">Major Cost Drivers</h4>
                                </div>
                                <ul className="space-y-3">
                                    {calculationResult.ai_insights.major_cost_drivers?.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-secondary">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Practical Suggestions */}
                            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-blue-900">Practical Suggestions</h4>
                                </div>
                                <ul className="space-y-3">
                                    {calculationResult.ai_insights.practical_suggestions?.map((item, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-blue-800/80">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tables Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CalculationTable
                        title={t('history.materialQuantity')}
                        headers={[t('history.headers.material'), t('history.headers.quantity'), t('history.headers.unit')]}
                        data={getMaterialData()}
                    />

                    <CalculationTable
                        title={t('history.workCost')}
                        headers={[t('history.headers.material'), t('history.headers.amount')]}
                        data={getWorkCostData()}
                    />
                </div>
            </div>
        </div>
    );
};

export default HistoryDetails;
