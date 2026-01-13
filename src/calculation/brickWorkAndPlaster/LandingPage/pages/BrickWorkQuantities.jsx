import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../../../components/layout/PageHeader';
import BrickAccordion from '../components/BrickAccordion';
import { useNavigate } from 'react-router-dom';

// Section Components
import QuantitySection from '../components/QuantitySection';
import BondsSection from '../components/BondsSection';
import CloserQuantitySection from '../components/CloserQuantitySection';
import ShapesSection from '../components/ShapesSection';

const BrickWorkQuantities = () => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();

    return (
        <div className="min-h-screen max-w-7xl mx-auto">
            <div className="mb-8">
                <PageHeader
                    title={t('quickActions.items.brickWorkPlaster')}
                    showBackButton
                    onBack={() => navigate(-1)}
                />
            </div>

            <div className="">
                <BrickAccordion title={t('brickWorkAndPlaster.sections.quantity')} defaultOpen={true}>
                    <QuantitySection />
                </BrickAccordion>

                <BrickAccordion title={t('brickWorkAndPlaster.sections.bonds')}>
                    <BondsSection />
                </BrickAccordion>

                <BrickAccordion title={t('brickWorkAndPlaster.sections.closerQuantity')}>
                    <CloserQuantitySection />
                </BrickAccordion>

                <BrickAccordion title={t('brickWorkAndPlaster.sections.shapes')}>
                    <ShapesSection />
                </BrickAccordion>
            </div>
        </div>
    );
};

export default BrickWorkQuantities;
