/**
 * Add Vendor Modal Component
 * Modal for adding new vendor with name and contact number
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PhoneInput from '../../../components/ui/PhoneInput';
import { useTranslation } from 'react-i18next';

export default function AddVendorModal({
  isOpen,
  onClose,
  onSave,
  t,
}) {
  const [vendorName, setVendorName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVendorName('');
      setCountryCode('+91');
      setContactNumber('');
      setErrors({});
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
      handleClose();
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
    
    if (!vendorName.trim()) {
      newErrors.vendorName = t('addStock.errors.vendorNameRequired', { defaultValue: 'Vendor name is required' });
    }
    
    const cleanedNumber = contactNumber.replace(/\s/g, '');
    if (!cleanedNumber) {
      newErrors.contactNumber = t('addStock.errors.contactNumberRequired', { defaultValue: 'Contact number is required' });
    } else if (!/^\d{10}$/.test(cleanedNumber)) {
      newErrors.contactNumber = t('addStock.errors.invalidContactNumber', { defaultValue: 'Please enter a valid 10-digit contact number' });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    
    try {
      await onSave({
        name: vendorName.trim(),
        countryCode,
        contactNumber: contactNumber.trim(),
      });
      
      setVendorName('');
      setCountryCode('+91');
      setContactNumber('');
      onClose();
    } catch (error) {
      console.error('Error saving vendor:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
      setVendorName('');
      setCountryCode('+91');
      setContactNumber('');
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg my-auto">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className="text-2xl font-medium text-primary">
            {t('addStock.addNewVendor', { defaultValue: 'Add New Vendor' })}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="transition-colors cursor-pointer"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Vendor Name */}
          <div>
            <Input
              label={t('addStock.vendorName', { defaultValue: 'Vendor Name' })}
              value={vendorName}
              onChange={(e) => {
                setVendorName(e.target.value);
                if (errors.vendorName) {
                  setErrors((prev) => ({ ...prev, vendorName: '' }));
                }
              }}
              placeholder={t('addStock.vendorNamePlaceholder', { defaultValue: 'Enter vendor name' })}
              error={errors.vendorName}
              disabled={isSaving}
              autoFocus
            />
          </div>

          {/* Contact Number */}
          <div>
            <PhoneInput
              label={t('addStock.contactNumber', { defaultValue: 'Contact Number' })}
              placeholder={t('addStock.contactNumberPlaceholder', { defaultValue: '000 000 0000' })}
              value={contactNumber}
              onChange={(e) => {
                setContactNumber(e.target.value);
                if (errors.contactNumber) {
                  setErrors((prev) => ({ ...prev, contactNumber: '' }));
                }
              }}
              countryCode={countryCode}
              onCountryCodeChange={(code) => {
                setCountryCode(code);
              }}
              required
              error={errors.contactNumber}
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
            {t('addStock.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving || !vendorName.trim() || !contactNumber.trim()}>
            {isSaving
              ? t('addStock.adding', { defaultValue: 'Adding...' })
              : t('addStock.addVendor', { defaultValue: 'Add Vendor' })}
          </Button>
        </div>
      </div>
    </div>
  );
}

