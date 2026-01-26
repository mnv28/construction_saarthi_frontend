import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../../components/layout/PageHeader';
import CalculationSummary from '../components/CalculationSummary';
import CalculationTable from '../components/CalculationTable';
import Loader from '../../../components/ui/Loader';
import { getCalculationHistory } from '../../../features/projects/api/projectApi';
import dayjs from 'dayjs';
import { getRoute } from '../../../constants/routes';
import { ROUTES_FLAT } from '../../../constants/routes';

const CalculationHistory = () => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setIsLoading(true);
            const data = await getCalculationHistory();
            setHistory(data || []);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to format material labels (mirrored from ConstructionCost)
    const formatLabel = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(' Inr', '').replace(' Nos', '').replace(' Ton', '').replace(' Bags', '').replace(' Liter', '').replace(' Kg', '').replace(' Sqft', '');
    };

    const getPreviewData = (item) => {
        const materialQty = item.generated_content?.calculation?.material_quantity;
        if (!materialQty) return [];

        // Show first 3 items as preview
        return Object.entries(materialQty).slice(0, 3).map(([key, value]) => ({
            material: formatLabel(key),
            quantity: value.toLocaleString(),
            unit: key.split('_').pop().charAt(0).toUpperCase() + key.split('_').pop().slice(1)
        }));
    };

    const filteredHistory = Array.isArray(history) ? history.filter(item => {
        const title = item.promptDetail?.title || 'Calculation';
        const category = item.feature?.feature || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase());
    }) : [];

    const handleViewDetails = (id) => {
        navigate(getRoute(ROUTES_FLAT.CALCULATION_DETAILS, { id }));
    };

    return (
        <div className="min-h-screen bg-transparent pb-10">
            <div className="max-w-7xl mx-auto px-0">
                <div className="mb-6">
                    <PageHeader
                        title={`History • ${t('quickActions.items.constructionCost')}`}
                        showBackButton
                        onBack={() => window.history.back()}
                    />
                </div>

                {/* Shared Stats Component */}
                <CalculationSummary showBuyButton={false} />

                {/* Search Input */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-[#717171]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search Calculations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#060C120F] rounded-2xl focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm sm:text-base"
                    />
                </div>

                {/* History List */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="lg" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {filteredHistory.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-[#F0F0F0] px-4 sm:px-6 pt-4 sm:pt-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-bold text-accent">
                                            {item.promptDetail?.title || 'Construction Cost'}
                                            <span className="text-primary-light font-medium"> • {formatLabel(item.feature?.feature || '')}</span>
                                        </h4>
                                    </div>
                                    <span className="text-sm text-primary-light">
                                        {dayjs(item.createdAt).format('DD-MM-YYYY h:mm a')}
                                    </span>
                                </div>

                                <CalculationTable
                                    title={t('history.materialQuantity')}
                                    data={getPreviewData(item)}
                                    headers={[t('history.headers.material'), t('history.headers.quantity'), t('history.headers.unit')]}
                                />

                                <div className="text-end py-2">
                                    <span
                                        onClick={() => handleViewDetails(item.id)}
                                        className="text-accent text-sm font-medium cursor-pointer hover:underline"
                                    >
                                        {t('history.headers.viewDetails')}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {filteredHistory.length === 0 && (
                            <div className="text-center py-10 text-[#717171]">
                                No calculations found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculationHistory;
