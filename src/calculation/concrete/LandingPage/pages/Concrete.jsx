import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../../../components/layout/PageHeader';
import ConcreteAccordion from '../components/ConcreteAccordion';
import { useNavigate } from 'react-router-dom';

// Section Components
import ByVolumeSection from '../components/ByVolumeSection';
import ColumnSection from '../components/ColumnSection';
import FootingSection from '../components/FootingSection';
import StaircaseSection from '../components/StaircaseSection';
import WallSection from '../components/WallSection';
import CurbedStoneSection from '../components/CurbedStoneSection';
import TubeSection from '../components/TubeSection';
import GutterSection from '../components/GutterSection';

const Concrete = () => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();

    const handleItemClick = (itemTitle) => {

        // Check for By Volume
        if (itemTitle === t('concrete.byVolume.concreteByVolume', { defaultValue: 'concrete By Volume' })) {
            navigate('/calculation/concrete/volume');
            return;
        }
        // Check for Square Column
        if (itemTitle === t('concrete.column.squareColumn', { defaultValue: 'Concrete of Square Column' })) {
            navigate('/calculation/concrete/column/square');
            return;
        }
        
        // Check for Rectangular Column
        if (itemTitle === t('concrete.column.rectangularColumn', { defaultValue: 'Concrete of Rectangular Column' })) {
            navigate('/calculation/concrete/column/rectangular');
            return;
        }
        
        // Check for Round Column
        if (itemTitle === t('concrete.column.roundColumn', { defaultValue: 'Concrete of Round Column' })) {
            navigate('/calculation/concrete/column/round');
            return;
        }
        
        // Check for Box Footing
        if (itemTitle === t('concrete.footing.boxFooting', { defaultValue: 'Concrete of Box Footing' })) {
            navigate('/calculation/concrete/footing/box');
            return;
        }
        
        // Check for Trapezoidal Footing
        if (itemTitle === t('concrete.footing.trapezoidalFooting', { defaultValue: 'Concrete of Trapezoidal Footing' })) {
            navigate('/calculation/concrete/footing/trapezoidal');
            return;
        }

        // Check for Straight Staircase
        if (itemTitle === t('concrete.staircase.straightStaircase', { defaultValue: 'Concrete of Straight Staircase' })) {
            navigate('/calculation/concrete/staircase/straight');
            return;
        }

        // Check for Dog Legged Staircase
        if (itemTitle === t('concrete.staircase.dogLeggedStaircase', { defaultValue: 'Concrete of Dog Legged Staircase' })) {
            navigate('/calculation/concrete/staircase/dog-legged');
            return;
        }

        // Check for Wall Shape 1
        if (itemTitle === t('concrete.wall.wallShape1', { defaultValue: 'Concrete of Wall Shape 1' })) {
            navigate('/calculation/concrete/wall/shape1');
            return;
        }

        // Check for Wall Shape 2
        if (itemTitle === t('concrete.wall.wallShape2', { defaultValue: 'Concrete of Wall Shape 2' })) {
            navigate('/calculation/concrete/wall/shape2');
            return;
        }

        // Check for Curb Stone 1
        if (itemTitle === t('concrete.curbedStone.curbStone1', { defaultValue: 'Concrete of Curb Stone 1' })) {
            navigate('/calculation/concrete/curbed-stone-1');
            return;
        }

        // Check for Curb Stone 2
        if (itemTitle === t('concrete.curbedStone.curbStone2', { defaultValue: 'Concrete of Curb Stone 2' })) {
            navigate('/calculation/concrete/curbed-stone-2');
            return;
        }

        // Check for Simple Tube
        if (itemTitle === t('concrete.tube.simpleTube', { defaultValue: 'Concrete of Simple Tube' })) {
            navigate('/calculation/concrete/simple-tube');
            return;
        }

        // Check for Square Tube
        if (itemTitle === t('concrete.tube.squareTube', { defaultValue: 'Concrete of Square Tube' })) {
            navigate('/calculation/concrete/square-tube');
            return;
        }

        // Check for Gutter Shape 1
        if (itemTitle === t('concrete.gutter.gutterShape1', { defaultValue: 'Concrete of Gutter Shape 1' })) {
            navigate('/calculation/concrete/gutter-shape-1');
            return;
        }

        // Check for Gutter Shape 2
        if (itemTitle === t('concrete.gutter.gutterShape2', { defaultValue: 'Concrete of Gutter Shape 2' })) {
            navigate('/calculation/concrete/gutter-shape-2');
            return;
        }
        
        // Navigate to coming soon page for other items
        navigate('/calculation/coming-soon', {
            state: {
                title: itemTitle,
                pageName: itemTitle,
            },
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <PageHeader
                    title={t('quickActions.items.concrete', { defaultValue: 'Concrete' })}
                    showBackButton
                    onBack={() => navigate(-1)}
                />
            </div>

            <div className="">
                <ConcreteAccordion title={t('concrete.sections.byVolume', { defaultValue: 'By Volume' })} defaultOpen={true}>
                    <ByVolumeSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.column', { defaultValue: 'Column' })}>
                    <ColumnSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.footing', { defaultValue: 'Footing' })}>
                    <FootingSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.staircase', { defaultValue: 'Staircase' })}>
                    <StaircaseSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.wall', { defaultValue: 'Wall' })}>
                    <WallSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.curbedStone', { defaultValue: 'Curbed Stone' })}>
                    <CurbedStoneSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.tube', { defaultValue: 'Tube' })}>
                    <TubeSection onItemClick={handleItemClick} />
                </ConcreteAccordion>

                <ConcreteAccordion title={t('concrete.sections.gutter', { defaultValue: 'Gutter' })}>
                    <GutterSection onItemClick={handleItemClick} />
                </ConcreteAccordion>
            </div>
        </div>
    );
};

export default Concrete;

