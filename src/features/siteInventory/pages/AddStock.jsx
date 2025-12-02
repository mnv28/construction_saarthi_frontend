/**
 * Add Stock Page
 * Form for adding stock to restock requests
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../../components/layout/PageHeader';
import NumberInput from '../../../components/ui/NumberInput';
import Dropdown from '../../../components/ui/Dropdown';
import Button from '../../../components/ui/Button';
import { ROUTES_FLAT } from '../../../constants/routes';
import { getVendorsList, createVendor } from '../api/siteInventoryApi';
import { showSuccess, showError } from '../../../utils/toast';
import AddVendorModal from '../components/AddVendorModal';

export default function AddStock() {
  const { t } = useTranslation('siteInventory');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { request, projectId, projectName } = location.state || {};
  
  const [quantity, setQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  // Get unit from request
  const unit = request?.quantityUnit || 'piece';

  // Fetch vendors from API
  useEffect(() => {
    loadVendors();
  }, []);

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

  const loadVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await getVendorsList();
      
      // Handle different response structures
      let vendorsArray = [];
      
      if (Array.isArray(response?.data)) {
        vendorsArray = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        vendorsArray = response.data.data;
      } else if (Array.isArray(response)) {
        vendorsArray = response;
      } else if (response?.data && typeof response.data === 'object') {
        vendorsArray = response.data.data || Object.values(response.data).filter(Array.isArray)[0] || [];
      }
      
      // Transform vendors to dropdown options format
      const options = vendorsArray.map((vendor) => ({
        value: vendor.id || vendor._id || vendor.vendorId,
        label: vendor.name || vendor.vendorName || vendor.label || vendor,
      }));
      
      setVendorOptions(options);
    } catch (error) {
      console.error('Error loading vendors:', error);
      setVendorOptions([]);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const handleAddNewVendor = async (vendorData) => {
    try {
      // Create vendor via API
      const response = await createVendor({
        name: vendorData.name,
        countryCode: vendorData.countryCode,
        contactNumber: vendorData.contactNumber,
      });
      
      // Get the created vendor data
      const createdVendor = response?.data?.data || response?.data || vendorData;
      
      // Add to options list
      const newOption = {
        value: createdVendor.id || createdVendor._id || Date.now().toString(),
        label: createdVendor.name || vendorData.name,
      };
      
      setVendorOptions((prev) => [...prev, newOption]);
      
      // Select the newly created vendor
      setSelectedVendor(newOption.value);
      
      showSuccess(t('addStock.vendorAdded', { defaultValue: 'Vendor added successfully' }));
      
      return newOption;
    } catch (error) {
      console.error('Error creating vendor:', error);
      const errorMessage = error?.response?.data?.message || error?.message || t('addStock.vendorAddFailed', { defaultValue: 'Failed to add vendor' });
      showError(errorMessage);
      throw error;
    }
  };

  const handleVendorSelect = (value) => {
    setSelectedVendor(value);
    if (errors.vendor) {
      setErrors((prev) => ({ ...prev, vendor: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = t('addStock.errors.quantityRequired', { defaultValue: 'Quantity is required' });
    }
    
    if (!selectedVendor) {
      newErrors.vendor = t('addStock.errors.vendorRequired', { defaultValue: 'Vendor is required' });
    }
    
    if (!totalPrice || parseFloat(totalPrice) <= 0) {
      newErrors.totalPrice = t('addStock.errors.totalPriceRequired', { defaultValue: 'Total price is required' });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to add stock
      console.log('Adding stock:', {
        requestId: request?.id,
        quantity: parseFloat(quantity),
        costPerUnit: parseFloat(costPerUnit) || 0,
        totalPrice: parseFloat(totalPrice),
        vendorId: selectedVendor,
      });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Navigate back after success
      navigate(-1);
    } catch (error) {
      console.error('Error adding stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!request) {
    // If no request data, redirect back
    navigate(-1);
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={`${t('addStock.title', { defaultValue: 'Restock Material' })} • ${request.materialName || ''}`}
        showBackButton
        onBack={handleBack}
      />

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quantity */}
            <div>
              <NumberInput
                label={t('addStock.quantity', { defaultValue: 'Quantity' })}
                placeholder="00"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantity(value);
                  if (errors.quantity) {
                    setErrors((prev) => ({ ...prev, quantity: '' }));
                  }
                }}
                required
                error={errors.quantity}
                className="w-full"
              />
            </div>

            {/* Cost Per Unit */}
            <div>
              <NumberInput
                label={t('addStock.costPerUnit', { defaultValue: 'Cost Per Unit' })}
                placeholder="00"
                value={costPerUnit}
                onChange={(e) => {
                  const value = e.target.value;
                  setCostPerUnit(value);
                }}
                unit={unit}
                showCurrency
                className="w-full"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Vendor */}
            <div>
              <Dropdown
                label={t('addStock.vendor', { defaultValue: 'Vendor' })}
                options={vendorOptions}
                value={selectedVendor}
                onChange={handleVendorSelect}
                placeholder={t('addStock.vendorPlaceholder', { defaultValue: 'Select Vendor' })}
                error={errors.vendor}
                className="w-full"
                showSeparator={true}
                addButtonLabel={t('addStock.addNewVendor', { defaultValue: 'Add New Vendor' })}
                onAddNew={handleAddNewVendor}
                disabled={isLoadingVendors}
                customModal={AddVendorModal}
                customModalProps={{ t }}
              />
            </div>

            {/* Total Price */}
            <div>
              <NumberInput
                label={t('addStock.totalPrice', { defaultValue: 'Total Price' })}
                placeholder="00"
                value={totalPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setTotalPrice(value);
                  if (errors.totalPrice) {
                    setErrors((prev) => ({ ...prev, totalPrice: '' }));
                  }
                }}
                required
                error={errors.totalPrice}
                showCurrency
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-8 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={isSubmitting}
          >
            {t('addStock.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto order-1 sm:order-2"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t('addStock.restocking', { defaultValue: 'Restocking...' })
              : t('addStock.restockMaterial', { defaultValue: 'Restock Material' })}
          </Button>
        </div>
      </form>
    </div>
  );
}

