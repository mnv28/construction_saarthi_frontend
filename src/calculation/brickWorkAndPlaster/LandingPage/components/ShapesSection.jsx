import React from 'react';
import { useTranslation } from 'react-i18next';
import BrickWorkItem from './BrickWorkItem';
import { useNavigate } from 'react-router-dom';
import byVolume from '../../../../assets/icons/byVolume.svg';
import byCube from '../../../../assets/icons/byCube.svg';
import byWall from '../../../../assets/icons/byWall.svg';
import lWall from '../../../../assets/icons/lWall.svg';
import cWall from '../../../../assets/icons/cWall.svg';
import rectangularChamber from '../../../../assets/icons/rectangularChamber.svg';
import wallWithDoor from '../../../../assets/icons/wallWithDoor.svg';
import wallWithArcDoor from '../../../../assets/icons/wallWithArcDoor.svg';
import cavityWall from '../../../../assets/icons/cavityWall.svg';
import buttressWall from '../../../../assets/icons/buttressWall.svg';

const ShapesSection = () => {
    const { t } = useTranslation('calculation');
    const navigate = useNavigate();

    const items = [
        { id: 'byVolume', title: t('brickWorkAndPlaster.shapes.byVolume'), icon: byVolume, path: '#' },
        { id: 'byCube', title: t('brickWorkAndPlaster.shapes.byCube'), icon: byCube, path: '#' },
        { id: 'byWall', title: t('brickWorkAndPlaster.shapes.byWall'), icon: byWall, path: '#' },
        { id: 'lWall', title: t('brickWorkAndPlaster.shapes.lWall'), icon: lWall, path: '#' },
        { id: 'cWall', title: t('brickWorkAndPlaster.shapes.cWall'), icon: cWall, path: '#' },
        { id: 'rectangularChamber', title: t('brickWorkAndPlaster.shapes.rectangularChamber'), icon: rectangularChamber, path: '#' },
        { id: 'wallWithDoor', title: t('brickWorkAndPlaster.shapes.wallWithDoor'), icon: wallWithDoor, path: '#' },
        { id: 'wallWithArcDoor', title: t('brickWorkAndPlaster.shapes.wallWithArcDoor'), icon: wallWithArcDoor, path: '#' },
        { id: 'cavityWall', title: t('brickWorkAndPlaster.shapes.cavityWall'), icon: cavityWall, path: '#' },
        { id: 'buttressWall', title: t('brickWorkAndPlaster.shapes.buttressWall'), icon: buttressWall, path: '#' },
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

export default ShapesSection;
