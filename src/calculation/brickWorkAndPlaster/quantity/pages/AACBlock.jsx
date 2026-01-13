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
import aacQt from '../../../../assets/icons/aacQt.svg';

const AACBlock = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('calculation');

    // Brick Size (mm)
    const [brickL, setBrickL] = useState('');
    const [brickW, setBrickW] = useState('');
    const [brickT, setBrickT] = useState('');

    // Wall Size (m)
    const [wallL, setWallL] = useState('');
    const [wallH, setWallH] = useState('');
    const [wallT, setWallT] = useState('');

    // Deductions (m)
    const [w1, setW1] = useState('');
    const [h1, setH1] = useState('');
    const [w2, setW2] = useState('');
    const [h2, setH2] = useState('');
    const [w3, setW3] = useState('');
    const [h3, setH3] = useState('');

    // Price
    const [brickPrice, setBrickPrice] = useState('');

    const [showResult, setShowResult] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [unitType, setUnitType] = useState('metric');

    // Calculation Logic
    const L_m = (parseFloat(brickL) || 0) / 1000;
    const W_m = (parseFloat(brickW) || 0) / 1000;
    const T_m = (parseFloat(brickT) || 0) / 1000;

    const l = parseFloat(wallL) || 0;
    const h = parseFloat(wallH) || 0;
    const t_wall = parseFloat(wallT) || 0;

    const W1 = parseFloat(w1) || 0;
    const H1 = parseFloat(h1) || 0;
    const W2 = parseFloat(w2) || 0;
    const H2 = parseFloat(h2) || 0;
    const W3 = parseFloat(w3) || 0;
    const H3 = parseFloat(h3) || 0;

    const B1 = parseFloat(brickPrice) || 0;

    // Volume of Wall = (lxhxt)-(W1XH1xt+W2xH2xt+W3xH3xt)
    const volumeOfWall = (l * h * t_wall) - (W1 * H1 * t_wall + W2 * H2 * t_wall + W3 * H3 * t_wall);

    // No of Bricks = V / ((L+0.005)xwx(T+0.005))
    // Using 0.005m (5mm) as mortar thickness for AAC (following image logic but realistic)
    const brickWithMortarVol = (L_m + 0.005) * W_m * (T_m + 0.005);
    const noOfBricks = brickWithMortarVol > 0 ? volumeOfWall / brickWithMortarVol : 0;

    // Costs
    const brickCostVal = noOfBricks * B1;

    const handleReset = () => {
        setBrickL(''); setBrickW(''); setBrickT('');
        setWallL(''); setWallH(''); setWallT('');
        setW1(''); setH1(''); setW2(''); setH2(''); setW3(''); setH3('');
        setBrickPrice('');
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
        { labelKey: 'brickWorkAndPlaster.aacBlock.brickLength', symbol: 'L', value: `${brickL || 0} mm` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.brickWidth', symbol: 'W', value: `${brickW || 0} mm` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.brickThickness', symbol: 'T', value: `${brickT || 0} mm` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.wallLength', symbol: 'l', value: `${wallL || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.wallHeight', symbol: 'h', value: `${wallH || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.wallThickness', symbol: 't', value: `${wallT || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.w1', symbol: '-', value: `${w1 || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.h1', symbol: '-', value: `${h1 || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.w2', symbol: '-', value: `${w2 || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.h2', symbol: '-', value: `${h2 || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.w3', symbol: '-', value: `${w3 || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.h3', symbol: '-', value: `${h3 || 0} m` },
        { labelKey: 'brickWorkAndPlaster.aacBlock.brickPrice', symbol: 'B1', value: `${brickPrice || 0} currency per unit` },
    ];

    const detailedOutputs = [
        {
            titleKey: 'brickWorkAndPlaster.aacBlock.results.volumeOfWall',
            labelKey: 'brickWorkAndPlaster.aacBlock.results.volumeOfWall',
            labelSuffix: '=',
            formula: '(lxhxt)-(W1XH1xt+W2xH2xt+W3xH3xt)',
            value: `${volumeOfWall.toFixed(3)} m3`
        },
        {
            titleKey: 'brickWorkAndPlaster.aacBlock.results.noOfBricks',
            labelKey: 'brickWorkAndPlaster.aacBlock.results.noOfBricks',
            labelSuffix: '=',
            formula: '((lxhxt)-(W1XH1xt+W2xH2xt+W3xH3xt))/((L+0.05)xwx(T+0.05))',
            value: `${noOfBricks.toFixed(3)} NOS`
        },
        {
            titleKey: 'brickWorkAndPlaster.aacBlock.results.brickCost',
            labelKey: 'brickWorkAndPlaster.aacBlock.results.brickCost',
            labelSuffix: '=',
            formula: 'B1 * ((lxhxt)-(W1XH1xt+W2xH2xt+W3xH3xt))/((L+0.05)xwx(T+0.05))',
            value: `${brickCostVal.toFixed(3)} CURRENCY`
        }
    ];

    return (
        <div className="min-h-screen max-w-7xl mx-auto pb-20">
            <div className="mb-6">
                <PageHeader
                    title={t('brickWorkAndPlaster.aacBlock.title')}
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
                        <img src={aacQt} alt="AAC Block" className="object-contain" />
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    {/* Brick Size */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-primary ml-1">{t('brickWorkAndPlaster.aacBlock.brickSize')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                            <InputField
                                unit="mm"
                                value={brickL}
                                onChange={(e) => setBrickL(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.aacBlock.brickLength')}
                            />
                            <InputField
                                unit="mm"
                                value={brickW}
                                onChange={(e) => setBrickW(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.aacBlock.brickWidth')}
                            />
                            <div className="col-span-2 md:col-span-1">
                                <InputField
                                    unit="mm"
                                    value={brickT}
                                    onChange={(e) => setBrickT(e.target.value)}
                                    placeholder={t('brickWorkAndPlaster.aacBlock.brickThickness')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Wall Size */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-primary ml-1">{t('brickWorkAndPlaster.aacBlock.wallSize')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                            <InputField
                                unit="m"
                                value={wallL}
                                onChange={(e) => setWallL(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.aacBlock.wallLength')}
                            />
                            <InputField
                                unit="m"
                                value={wallH}
                                onChange={(e) => setWallH(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.aacBlock.wallHeight')}
                            />
                            <div className="col-span-2 md:col-span-1">
                                <InputField
                                    unit="m"
                                    value={wallT}
                                    onChange={(e) => setWallT(e.target.value)}
                                    placeholder={t('brickWorkAndPlaster.aacBlock.wallThickness')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-primary ml-1">{t('brickWorkAndPlaster.aacBlock.deductions')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                            <div className="order-1 md:order-1">
                                <InputField unit="m" value={w1} onChange={(e) => setW1(e.target.value)} placeholder={t('brickWorkAndPlaster.aacBlock.w1')} />
                            </div>
                            <div className="order-2 md:order-4">
                                <InputField unit="m" value={h1} onChange={(e) => setH1(e.target.value)} placeholder={t('brickWorkAndPlaster.aacBlock.h1')} />
                            </div>
                            <div className="order-3 md:order-2">
                                <InputField unit="m" value={w2} onChange={(e) => setW2(e.target.value)} placeholder={t('brickWorkAndPlaster.aacBlock.w2')} />
                            </div>
                            <div className="order-4 md:order-5">
                                <InputField unit="m" value={h2} onChange={(e) => setH2(e.target.value)} placeholder={t('brickWorkAndPlaster.aacBlock.h2')} />
                            </div>
                            <div className="order-5 md:order-3">
                                <InputField unit="m" value={w3} onChange={(e) => setW3(e.target.value)} placeholder={t('brickWorkAndPlaster.aacBlock.w3')} />
                            </div>
                            <div className="order-6 md:order-6">
                                <InputField unit="m" value={h3} onChange={(e) => setH3(e.target.value)} placeholder={t('brickWorkAndPlaster.aacBlock.h3')} />
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-primary ml-1">{t('brickWorkAndPlaster.aacBlock.price')}</h3>
                        <div className="grid gap-2 md:gap-4">
                            <InputField
                                suffix="₹/Unit"
                                value={brickPrice}
                                onChange={(e) => setBrickPrice(e.target.value)}
                                placeholder={t('brickWorkAndPlaster.aacBlock.brickPrice')}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 sm:gap-6 mt-8">
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        className="h-[50px] sm:h-[58px] flex-1 sm:flex-none px-6 sm:px-12 border-[#E7D7C1] !rounded-2xl text-primary font-medium text-sm sm:text-base"
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
                                    { material: t('brickWorkAndPlaster.aacBlock.results.volumeOfWall'), quantity: volumeOfWall.toFixed(3), unit: 'm³' },
                                    { material: t('brickWorkAndPlaster.aacBlock.results.noOfBricks'), quantity: noOfBricks.toFixed(3), unit: 'NOS' },
                                    { material: t('brickWorkAndPlaster.aacBlock.results.brickCost'), quantity: brickCostVal.toFixed(3), unit: '₹' },
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
                            <span className="font-medium text-primary uppercase text-sm tracking-wider">{t('brickWorkAndPlaster.aacBlock.results.totalCost')}</span>
                            <span className="font-bold text-accent text-xl">₹{brickCostVal.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => navigate(ROUTES_FLAT.CALCULATION_AAC_BLOCK_DETAILED, {
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
                defaultTitle={t('brickWorkAndPlaster.aacBlock.detailedTitle')}
                isLoading={isDownloading}
            />
        </div>
    );
};

export default AACBlock;
