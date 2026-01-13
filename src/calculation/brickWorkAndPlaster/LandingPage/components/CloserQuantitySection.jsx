import React from 'react';
import { useTranslation } from 'react-i18next';
import BrickWorkItem from './BrickWorkItem';
import { useNavigate } from 'react-router-dom';
import kingCloser from '../../../../assets/icons/kingCloser.svg';
import queenCloser from '../../../../assets/icons/queenCloser.svg';
import halfBatCloser from '../../../../assets/icons/halfBatCloser.svg';
import quarterBatCloser from '../../../../assets/icons/quarterBatCloser.svg';

const CloserQuantitySection = () => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();

    const items = [
        { id: 'king', title: t('brickWorkAndPlaster.closer.king'), icon: kingCloser, path: '#' },
        { id: 'queen', title: t('brickWorkAndPlaster.closer.queen'), icon: queenCloser, path: '#' },
        { id: 'halfBat', title: t('brickWorkAndPlaster.closer.halfBat'), icon: halfBatCloser, path: '#' },
        { id: 'quarterBat', title: t('brickWorkAndPlaster.closer.quarterBat'), icon: quarterBatCloser, path: '#' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-2">
            {items.map((item) => (
                <BrickWorkItem
                    key={item.id}
                    title={item.title}
                    icon={item.icon}
                    onClick={() => navigate(item.path)}
                />
            ))}
        </div>
    );
};

export default CloserQuantitySection;
