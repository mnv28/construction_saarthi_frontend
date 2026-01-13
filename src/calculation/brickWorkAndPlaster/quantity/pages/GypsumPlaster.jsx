import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import PageHeader from '../../../../components/layout/PageHeader';
import Button from '../../../../components/ui/Button';
import { ROUTES_FLAT } from '../../../../constants/routes';
import InputField from '../../../common/InputField';
import DownloadPDFModal from '../../../common/DownloadPDFModal';

// Import icons
import gypsumQt from '../../../../assets/icons/gypsumQt.svg';

const GypsumPlaster = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('calculation');

    // Wall Size (m)
    const [wallL, setWallL] = useState('');
    const [wallW, setWallW] = useState('');
    const [plasterT, setPlasterT] = useState('');

    // Price
    const [cementPrice, setCementPrice] = useState('');
    const [sandPrice, setSandPrice] = useState('');

    const [showResult, setShowResult] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [unitType, setUnitType] = useState('metric');

    // Calculation Logic
    const l = parseFloat(wallL) || 0;
    const w = parseFloat(wallW) || 0;
    const t_plaster = parseFloat(plasterT) || 0;
    const cPrice = parseFloat(cementPrice) || 0;
    const sPrice = parseFloat(sandPrice) || 0;

    // Plaster Area = LxW
    const plasterArea = l * w;

    // Plaster Volume = LXWXT
    const plasterVolume = l * w * t_plaster;

    // Weight Of Material = LXWXTX715
    const weightOfMaterial = plasterVolume * 715;

    // No of Bags (25 Kg) = (LXWXTX715)/25
    const noOfBags = weightOfMaterial / 25;

    // Material COST = cPrice * noOfBags + sPrice * plasterVolume (Assuming Sand price is per m3)
    const materialCostVal = (noOfBags * cPrice) + (plasterVolume * sPrice);
    const totalCostVal = materialCostVal;

    const handleReset = () => {
        setWallL(''); setWallW(''); setPlasterT('');
        setCementPrice(''); setSandPrice('');
        setShowResult(false);
    };

    const handleCalculate = () => {
        setShowResult(true);
    };

    const handleDownload = async (pdfTitle) => {
        try {
            setIsDownloading(true);
            console.log('Downloading PDF with title:', pdfTitle);
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
            setIsDownloadModalOpen(false);
        }
    };

    const calculationData = [
        { labelKey: 'brickWorkAndPlaster.gypsumPlaster.length', symbol: 'L', value: `${wallL || 0} m` },
        { labelKey: 'brickWorkAndPlaster.gypsumPlaster.width', symbol: 'W', value: `${wallW || 0} m` },
        { labelKey: 'brickWorkAndPlaster.gypsumPlaster.thickness', symbol: 'T', value: `${plasterT || 0} m` },
        { labelKey: 'brickWorkAndPlaster.gypsumPlaster.cement', symbol: 'C1', value: `${cementPrice || 0} currency` },
        { labelKey: 'brickWorkAndPlaster.gypsumPlaster.sand', symbol: 'S1', value: `${sandPrice || 0} currency per Unit` },
    ];

    const detailedOutputs = [
        {
            titleKey: 'brickWorkAndPlaster.gypsumPlaster.results.plasterArea',
            labelKey: 'brickWorkAndPlaster.gypsumPlaster.results.plasterArea',
            labelSuffix: '=',
            formula: 'LXw',
            value: `${plasterArea.toFixed(3)} sq.m.`
        },
        {
            titleKey: 'brickWorkAndPlaster.gypsumPlaster.results.plasterVolume',
            labelKey: 'brickWorkAndPlaster.gypsumPlaster.results.plasterVolume',
            labelSuffix: '=',
            formula: 'LXWXT',
            value: `${plasterVolume.toFixed(3)} m3`
        },
        {
            titleKey: 'brickWorkAndPlaster.gypsumPlaster.results.weightOfMaterial',
            labelKey: 'brickWorkAndPlaster.gypsumPlaster.results.weightOfMaterial',
            labelSuffix: '=',
            formula: 'LXWXTX715',
            value: `${weightOfMaterial.toFixed(3)} m3`
        },
        {
            titleKey: 'brickWorkAndPlaster.gypsumPlaster.results.noOfBags',
            labelKey: 'brickWorkAndPlaster.gypsumPlaster.results.noOfBags',
            labelSuffix: '=',
            formula: '(LxWXTX715)/25',
            value: `${noOfBags.toFixed(3)} NOS`
        },
        {
            titleKey: 'brickWorkAndPlaster.gypsumPlaster.results.materialCost',
            labelKey: 'brickWorkAndPlaster.gypsumPlaster.results.materialCost',
            labelSuffix: '=',
            formula: '(C1 * No of Bags) + (S1 * Plaster Volume)',
            value: `${materialCostVal.toFixed(3)} Currency`
        },
        {
            titleKey: 'brickWorkAndPlaster.gypsumPlaster.results.totalCost',
            labelKey: 'brickWorkAndPlaster.gypsumPlaster.results.totalCost',
            labelSuffix: '=',
            formula: 'Material Cost',
            value: `${totalCostVal.toFixed(3)} Currency`
        }
    ];

    return (
        <div className="min-h-screen max-w-7xl mx-auto pb-20">
            <div className="mb-6">
                <PageHeader
                    title={t('brickWorkAndPlaster.gypsumPlaster.title')}
                    showBackButton
                    onBack={() => navigate(-1)}
                >
                    <div className="flex gap-4 items-center">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDownloadModalOpen(true)}
                            className="border-[#E0E0E0] rounded-xl text-secondary !px-2 sm:!px-4 py-2"
                            leftIcon={<Download className="w-4 h-4 text-secondary " />}
                        >
                            <span className="text-sm font-medium">{t('history.downloadReport')}</span>
                        </Button>
                    </div>
                </PageHeader>
            </div>

            <div className="bg-[#F9F4EE] rounded-3xl p-4 sm:p-6">
                <div className="flex items-center gap-4 sm:gap-10 pb-6 border-b border-[#060C120A]">
                    <div className="flex items-center justify-center">
                        <img src={gypsumQt} alt="Gypsum Plaster" className="object-contain" />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    {/* Wall Size */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-primary ml-1">{t('brickWorkAndPlaster.gypsumPlaster.wallSize')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                            <InputField
                                unit="m"
                                value={wallL}
                                onChange={(e) => setWallL(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.gypsumPlaster.length')}
                            />
                            <InputField
                                unit="m"
                                value={wallW}
                                onChange={(e) => setWallW(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.gypsumPlaster.width')}
                            />
                            <div className="col-span-2 md:col-span-1">
                                <InputField
                                    unit="m"
                                    value={plasterT}
                                    onChange={(e) => setPlasterT(e.target.value)}
                                    placeholder={t('brickWorkAndPlaster.gypsumPlaster.thickness')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-primary ml-1">{t('brickWorkAndPlaster.gypsumPlaster.price')}</h3>
                        <div className="grid grid-cols-2 gap-2 md:gap-4">
                            <InputField
                                suffix="₹"
                                value={cementPrice}
                                onChange={(e) => setCementPrice(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.gypsumPlaster.cement')}
                            />
                            <InputField
                                suffix="₹/Unit"
                                value={sandPrice}
                                onChange={(e) => setSandPrice(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.gypsumPlaster.sand')}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 sm:gap-6 mt-8">
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        className="h-[50px] sm:h-[58px] flex-1 sm:flex-none px-6 sm:px-12 border-[#E7D7C1] bg-white !rounded-2xl text-primary font-medium text-sm sm:text-base"
                    >
                        {t('steel.weight.reset')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCalculate}
                        className="h-[50px] sm:h-[58px] flex-1 sm:flex-none px-6 sm:px-12 !bg-[#B02E0C] text-white !rounded-2xl font-medium text-sm sm:text-base"
                    >
                        {t('steel.weight.calculate')}
                    </Button>
                </div>
            </div>

            {showResult && (
                <div className="mt-10 animate-fade-in pb-10">
                    <h2 className="text-2xl font-semibold text-primary mb-6">{t('steel.weight.result')}</h2>

                    <div className="flex border-b border-[#060C121A] mb-8">
                        <button
                            onClick={() => setUnitType('metric')}
                            className={`px-12 py-3 border-b-2 transition-all cursor-pointer font-medium ${unitType === 'metric' ? 'border-accent text-accent' : 'border-transparent text-secondary'}`}
                        >
                            {t('steel.weight.metric')}
                        </button>
                        <button
                            onClick={() => setUnitType('imperial')}
                            className={`px-12 py-3 border-b-2 transition-all cursor-pointer font-medium ${unitType === 'imperial' ? 'border-accent text-accent' : 'border-transparent text-secondary'}`}
                        >
                            {t('steel.weight.imperial')}
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-[#060C121A] overflow-hidden mb-8 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[320px]">
                            <thead>
                                <tr className="bg-[#F7F7F7] border-b border-[#060C120A]">
                                    <th className="px-6 py-4 text-sm font-medium text-primary border-r border-[#060C120A]">{t('history.headers.material')}</th>
                                    <th className="px-6 py-4 text-sm font-medium text-primary border-r border-[#060C120A]">{t('history.headers.quantity')}</th>
                                    <th className="px-6 py-4 text-sm font-medium text-primary">{t('history.headers.unit')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#060C120A]">
                                {[
                                    { material: t('brickWorkAndPlaster.gypsumPlaster.results.plasterArea'), quantity: plasterArea.toFixed(3), unit: 'sq.m.' },
                                    { material: t('brickWorkAndPlaster.gypsumPlaster.results.plasterVolume'), quantity: plasterVolume.toFixed(3), unit: 'm³' },
                                    { material: t('brickWorkAndPlaster.gypsumPlaster.results.weightOfMaterial'), quantity: weightOfMaterial.toFixed(3), unit: 'm³' },
                                    { material: t('brickWorkAndPlaster.gypsumPlaster.results.noOfBags'), quantity: noOfBags.toFixed(3), unit: 'NOS' },
                                    { material: t('brickWorkAndPlaster.gypsumPlaster.results.materialCost'), quantity: materialCostVal.toFixed(3), unit: '₹' },
                                    { material: t('brickWorkAndPlaster.gypsumPlaster.results.totalCost'), quantity: totalCostVal.toFixed(3), unit: '₹' },
                                ].map((row, index) => (
                                    <tr key={index} className="hover:bg-[#F9F9F9] transition-colors">
                                        <td className="px-6 py-4 text-sm text-primary border-r border-[#060C120A]">{row.material}</td>
                                        <td className="px-6 py-4 text-sm text-primary border-r border-[#060C120A]">{row.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-primary">{row.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#FDF9F4] p-4 rounded-2xl flex items-center justify-between border border-[#F5E6D3] h-[58px]">
                            <span className="font-medium text-primary uppercase text-sm tracking-wider">{t('brickWorkAndPlaster.gypsumPlaster.results.totalCost')}</span>
                            <span className="font-bold text-accent text-xl">₹{totalCostVal.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => navigate(ROUTES_FLAT.CALCULATION_GYPSUM_PLASTER_DETAILED, {
                                state: {
                                    calculationData,
                                    outputs: detailedOutputs
                                }
                            })}
                            className="!rounded-2xl text-lg font-medium hover:bg-[#B02E0C] transition-all h-[58px]"
                        >
                            {t('steel.weight.viewDetailed')}
                        </Button>
                    </div>
                </div>
            )}

            <DownloadPDFModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                onDownload={handleDownload}
                defaultTitle={t('brickWorkAndPlaster.gypsumPlaster.detailedTitle')}
                isLoading={isDownloading}
            />
        </div>
    );
};

export default GypsumPlaster;
