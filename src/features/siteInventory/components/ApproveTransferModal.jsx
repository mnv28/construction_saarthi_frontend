/**
 * ApproveTransferModal Component
 * Modal for approving transfer requests with quantity, cost per unit, and total price
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import NumberInput from '../../../components/ui/NumberInput';

export default function ApproveTransferModal({
    isOpen,
    onClose,
    onApprove,
    request,
    formatCurrency,
}) {
    const { t } = useTranslation('siteInventory');

    const [quantity, setQuantity] = useState('');
    const [costPerUnit, setCostPerUnit] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form with request data when modal opens
    useEffect(() => {
        if (isOpen && request) {
            setQuantity(request.quantity?.toString() || '');
            setCostPerUnit(request.costPerUnit?.toString() || '');
            setTotalPrice(request.totalPrice?.toString() || '');
            setErrors({});
        }
    }, [isOpen, request]);

    // Calculate total price when quantity or cost per unit changes
    useEffect(() => {
        if (quantity && costPerUnit) {
            const qty = parseFloat(quantity) || 0;
            const cost = parseFloat(costPerUnit) || 0;
            if (qty > 0 && cost > 0) {
                const total = (qty * cost).toFixed(2);
                setTotalPrice(total);
            } else {
                setTotalPrice('');
            }
        } else {
            setTotalPrice('');
        }
    }, [quantity, costPerUnit]);

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal is closed
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyPress);
            return () => document.removeEventListener('keydown', handleKeyPress);
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors = {};

        if (!quantity || parseFloat(quantity) <= 0) {
            newErrors.quantity = t('approveModal.errors.quantityRequired', { defaultValue: 'Quantity is required' });
        }

        if (!totalPrice || parseFloat(totalPrice) <= 0) {
            newErrors.totalPrice = t('approveModal.errors.totalPriceRequired', { defaultValue: 'Total price is required' });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleApprove = async () => {
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            await onApprove?.({
                ...request,
                approvedQuantity: parseFloat(quantity),
                approvedCostPerUnit: parseFloat(costPerUnit) || 0,
                approvedTotalPrice: parseFloat(totalPrice),
            });
            onClose();
            // Reset form
            setQuantity('');
            setCostPerUnit('');
            setTotalPrice('');
            setErrors({});
        } catch (error) {
            console.error('Error approving transfer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
            setQuantity('');
            setCostPerUnit('');
            setTotalPrice('');
            setErrors({});
        }
    };

    if (!isOpen) return null;

    const unit = request?.quantityUnit || request?.unit || 'piece';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading) {
                    handleClose();
                }
            }}
        >
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg my-auto">
                {/* Header */}
                <div className="px-6 py-4">
                    <h3 className="text-2xl font-medium text-primary text-center">
                        {t('approveModal.title', { defaultValue: 'Approve Transfer Request' })}
                    </h3>
                </div>

                {/* Body */}
                <div className="px-6 pb-6 space-y-4">
                    {/* Confirmation Message */}
                    <div className="mb-4">
                        <p className="text-base text-secondary">
                            {t('approveModal.confirmationMessage', {
                                defaultValue: 'Are you sure you want to approve transfer request of {{materialName}} from {{fromProject}}?',
                            })
                                .replace('{{materialName}}', `<MATERIAL>`)
                                .replace('{{fromProject}}', `<PROJECT>`)
                                .split(/(<MATERIAL>|<PROJECT>)/g)
                                .map((part, index) => {
                                    if (part === '<MATERIAL>') {
                                        return (
                                            <span key={index} className="text-primary font-medium">
                                                {request?.materialName}
                                            </span>
                                        );
                                    }
                                    if (part === '<PROJECT>') {
                                        return (
                                            <span key={index} className="text-primary font-medium">
                                                {request?.fromProject}
                                            </span>
                                        );
                                    }
                                    return part;
                                })}
                        </p>
                    </div>

                    {/* Quantity Field */}
                    <div>
                        <NumberInput
                            label={t('approveModal.quantity', { defaultValue: 'Quantity' })}
                            value={quantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuantity(value);
                                if (errors.quantity) {
                                    setErrors({ ...errors, quantity: '' });
                                }
                            }}
                            placeholder={t('approveModal.quantityPlaceholder', { defaultValue: 'Enter quantity' })}
                            required
                            error={errors.quantity}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Cost Per Unit and Total Price Fields - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Cost Per Unit Field */}
                        <div>
                            <NumberInput
                                label={t('approveModal.costPerUnit', { defaultValue: 'Cost Per Unit' })}
                                value={costPerUnit}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCostPerUnit(value);
                                }}
                                placeholder="00"
                                unit={unit}
                                showCurrency
                                disabled={isLoading}
                            />
                        </div>

                        {/* Total Price Field */}
                        <div>
                            <NumberInput
                                label={t('approveModal.totalPrice', { defaultValue: 'Total Price' })}
                                value={totalPrice}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setTotalPrice(value);
                                    if (errors.totalPrice) {
                                        setErrors({ ...errors, totalPrice: '' });
                                    }
                                }}
                                placeholder="00"
                                required
                                error={errors.totalPrice}
                                showCurrency
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 pb-6">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {t('approveModal.cancel', { defaultValue: 'Cancel' })}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleApprove}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t('approveModal.approving', { defaultValue: 'Approving...' })
                            : t('approveModal.approve', { defaultValue: 'Approve' })
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}

