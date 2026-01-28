import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import Dropdown from '../../../components/ui/Dropdown';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../hooks/useAuth';
import { useUnits } from '../hooks';

/**
 * Modal for editing an existing material
 */
export default function EditMaterialModal({
    isOpen,
    onClose,
    onSave,
    material,
}) {
    const { t } = useTranslation('siteInventory');
    const { selectedWorkspace } = useAuth();
    const { unitOptions, isLoadingUnits, createNewUnit, refetch: refetchUnits } = useUnits(selectedWorkspace);

    const [itemName, setItemName] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            refetchUnits();
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, refetchUnits]);

    // Initialize form data when material changes or modal opens
    useEffect(() => {
        if (isOpen && material) {
            // Extract display name from label or use name field
            const displayName = material.name ||
                (typeof material.label === 'string' ? material.label.split(' • ')[0] : '') ||
                '';
            setItemName(displayName);

            // Handle unit ID with safety checks for various field names and types
            const rawUnitId = material.unitId || material.unit_id || material.unitsId || '';
            setSelectedUnit(rawUnitId ? rawUnitId.toString() : '');

            setErrors({});
        }
    }, [isOpen, material]);

    const handleAddNewUnit = async (newUnit) => {
        try {
            const newOption = await createNewUnit(newUnit);
            setSelectedUnit(newOption.value);
            return newOption;
        } catch (error) {
            throw error;
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!itemName.trim()) {
            newErrors.itemName = t('addNewAsk.errors.itemNameRequired', { defaultValue: 'Material name is required' });
        }
        if (!selectedUnit) {
            newErrors.unit = t('addNewAsk.errors.unitRequired', { defaultValue: 'Unit is required' });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setIsSaving(true);
        try {
            await onSave({
                id: material.id,
                name: itemName.trim(),
                unitId: selectedUnit,
            });
            onClose();
        } catch (error) {
            console.error('Error updating material:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSaving) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md my-auto relative">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <h3 className="text-[20px] font-medium text-primary leading-tight">
                        {t('editMaterial.title', { defaultValue: 'Edit Material' })}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 cursor-pointer"
                        disabled={isSaving}
                    >
                        <X className="w-5 h-5 text-secondary" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">
                    {/* Material Name */}
                    <div className='pb-4'>
                        <Input
                            label={t('editMaterial.nameLabel', { defaultValue: 'Material Name' })}
                            value={itemName}
                            onChange={(e) => {
                                setItemName(e.target.value);
                                if (errors.itemName) setErrors((prev) => ({ ...prev, itemName: '' }));
                            }}
                            placeholder={t('editMaterial.namePlaceholder', { defaultValue: 'Enter material name' })}
                            required
                            error={errors.itemName}
                            disabled={isSaving}
                            className=""
                        />
                    </div>

                    {/* Unit */}
                    <div>
                        <Dropdown
                            label={t('editMaterial.unitLabel', { defaultValue: 'Unit' })}
                            options={unitOptions}
                            value={selectedUnit}
                            onChange={(val) => {
                                setSelectedUnit(val);
                                if (errors.unit) setErrors((prev) => ({ ...prev, unit: '' }));
                            }}
                            placeholder={t('editMaterial.unitPlaceholder', { defaultValue: 'Select Unit' })}
                            error={errors.unit}
                            required
                            showSeparator={true}
                            addButtonLabel={t('addNewAsk.addNewUnit', { defaultValue: 'Add New Unit' })}
                            onAddNew={handleAddNewUnit}
                            disabled={isLoadingUnits || isSaving}
                            className="!rounded-2xl"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 px-6 pb-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSaving}
                        className=" "
                    >
                        {t('common.cancel', { defaultValue: 'Cancel' })}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving || !itemName.trim() || !selectedUnit}
                        className=""
                    >
                        {isSaving
                            ? t('common.saving', { defaultValue: 'Saving...' })
                            : t('common.save', { defaultValue: 'Save' })}
                    </Button>
                </div>
            </div>
        </div>
    );
}
