/**
 * Add New Ask Page
 * Form for requesting materials from other projects
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, ChevronDown } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';
import Radio from '../../../components/ui/Radio';
import Dropdown from '../../../components/ui/Dropdown';
import NumberInput from '../../../components/ui/NumberInput';
import RichTextEditor from '../../../components/ui/RichTextEditor';
import Button from '../../../components/ui/Button';
import { ROUTES_FLAT } from '../../../constants/routes';
import { showSuccess, showError } from '../../../utils/toast';
import { useMaterials } from '../hooks';
import { requestMaterial } from '../api/siteInventoryApi';
import AddMaterialModal from '../components/AddMaterialModal';

export default function AddNewAsk() {
  const { t } = useTranslation('siteInventory');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get project context from navigation state (current project - where we're requesting TO)
  const currentProjectId = location.state?.projectId;
  
  const [materialType, setMaterialType] = useState('reusable');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { materialOptions, isLoadingMaterials, createNewMaterial, refetch: refetchMaterials } = useMaterials();

  // Get quantity unit based on material type
  const quantityUnit = materialType === 'reusable' ? 'sq.ft' : 'pieces';

  // Fetch materials from API
  useEffect(() => {
    refetchMaterials();
  }, [refetchMaterials]);

  // Handle adding new material (from custom modal)
  const handleAddNewMaterial = async (materialData) => {
    try {
      // Create material via hook
      const newOption = await createNewMaterial({
        ...materialData,
        type: materialType, // 'reusable' or 'consumable'
      });
      
      // Select the newly created material
      setSelectedMaterial(newOption.value);
      
      return newOption;
    } catch (error) {
      // Error is already handled in the hook
      throw error;
    }
  };

  // Mock projects list - replace with actual API call
  const projectOptions = [
    { value: 'shree-villa', label: 'Shree Villa' },
    { value: 'shiv-residency', label: 'Shiv Residency' },
    { value: 'green-park', label: 'Green Park' },
  ];

  const handleCancel = () => {
    navigate(-1);
  };

  const handleMaterialSelect = (value) => {
    setSelectedMaterial(value);
    if (errors.material) {
      setErrors((prev) => ({ ...prev, material: '' }));
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    if (errors.quantity) {
      setErrors((prev) => ({ ...prev, quantity: '' }));
    }
  };

  const handleProjectSelect = (value) => {
    const project = projectOptions.find((p) => p.value === value);
    if (project && !selectedProjects.find((p) => p.value === value)) {
      setSelectedProjects([...selectedProjects, project]);
    }
    if (errors.requestFrom) {
      setErrors((prev) => ({ ...prev, requestFrom: '' }));
    }
  };

  const handleRemoveProject = (value) => {
    setSelectedProjects(selectedProjects.filter((p) => p.value !== value));
  };

  const handleDescriptionChange = (newValue) => {
    setDescription(newValue);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!selectedMaterial) {
      newErrors.material = t('addNewAsk.errors.materialRequired', { defaultValue: 'Material is required' });
    }
    
    if (!quantity || quantity === '0' || quantity === '00') {
      newErrors.quantity = t('addNewAsk.errors.quantityRequired', { defaultValue: 'Quantity is required' });
    }
    
    if (selectedProjects.length === 0) {
      newErrors.requestFrom = t('addNewAsk.errors.requestFromRequired', { defaultValue: 'Please select at least one project' });
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
      if (!currentProjectId) {
        showError(t('addNewAsk.errors.projectRequired', { defaultValue: 'Project ID is required' }));
        setIsSubmitting(false);
        return;
      }

      if (selectedProjects.length === 0) {
        showError(t('addNewAsk.errors.projectsRequired', { defaultValue: 'Please select at least one project to request from' }));
        setIsSubmitting(false);
        return;
      }

      // API accepts single fromProjectId, so we'll use the first selected project
      // If multiple projects are selected, we could make multiple API calls
      const fromProjectId = selectedProjects[0].value;
      
      // Call API for each selected project (if multiple)
      const apiCalls = selectedProjects.map((project) =>
        requestMaterial({
          inventoryId: selectedMaterial,
          quantity: parseFloat(quantity) || 0,
          description: description,
          fromProjectId: project.value,
          toProjects: [currentProjectId], // Current project is where we're requesting TO
        })
      );

      await Promise.all(apiCalls);
      
      showSuccess(t('addNewAsk.success', { defaultValue: 'Material request sent successfully' }));
      
      // Navigate back after success
      navigate(-1);
    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMessage = error?.response?.data?.message || error?.message || t('addNewAsk.errors.submitFailed', { defaultValue: 'Failed to send material request' });
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={t('addNewAsk.title', { defaultValue: 'Add New Ask' })}
        showBackButton={true}
        onBack={handleCancel}
      />

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Material Type Radio Buttons */}
        <div className="mb-6 flex gap-6">
          <Radio
            name="materialType"
            value="reusable"
            checked={materialType === 'reusable'}
            onChange={(e) => setMaterialType(e.target.value)}
            label={t('materialType.reusable', { defaultValue: 'Reusable' })}
          />
          <Radio
            name="materialType"
            value="consumable"
            checked={materialType === 'consumable'}
            onChange={(e) => setMaterialType(e.target.value)}
            label={t('materialType.consumable', { defaultValue: 'Consumable' })}
          />
        </div>

        {/* Material Dropdown */}
        <div className="mb-6">
          <Dropdown
            label={t('addNewAsk.material', { defaultValue: 'Material' })}
            options={materialOptions}
            value={selectedMaterial}
            onChange={handleMaterialSelect}
            placeholder={t('addNewAsk.materialPlaceholder', { defaultValue: 'Select material' })}
            error={errors.material}
            className="w-full"
            showSeparator={true}
            addButtonLabel={t('addNewAsk.addNewMaterial', { defaultValue: 'Add New Material' })}
            onAddNew={handleAddNewMaterial}
            disabled={isLoadingMaterials}
            customModal={AddMaterialModal}
            customModalProps={{ materialType, t }}
          />
        </div>

        {/* Quantity Input */}
        <div className="mb-6">
          <NumberInput
            label={t('addNewAsk.quantity', { defaultValue: 'Quantity' })}
            placeholder="00"
            value={quantity}
            onChange={handleQuantityChange}
            required
            error={errors.quantity}
            unit={quantityUnit}
            className="w-full"
          />
        </div>

        {/* Request Material From */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            {t('addNewAsk.requestFrom', { defaultValue: 'Request Material From' })}
            <span className="text-accent ml-1">*</span>
          </label>
          
          {/* Selected Projects Tags */}
          {selectedProjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedProjects.map((project) => (
                <div
                  key={project.value}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200"
                >
                  <span className="text-sm text-primary">{project.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(project.value)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Project Dropdown */}
          <Dropdown
            options={projectOptions.filter(
              (p) => !selectedProjects.find((sp) => sp.value === p.value)
            )}
            value=""
            onChange={handleProjectSelect}
            placeholder={t('addNewAsk.requestFromPlaceholder', { defaultValue: 'Select project' })}
            error={errors.requestFrom}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-primary mb-2">
            {t('addNewAsk.description', { defaultValue: 'Description' })}
          </label>
          <RichTextEditor
            value={description}
            onChange={handleDescriptionChange}
            placeholder={t('addNewAsk.descriptionPlaceholder', { defaultValue: 'Enter text here' })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-8 pt-6 ">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={isSubmitting}
          >
            {t('addNewAsk.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto order-1 sm:order-2"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t('addNewAsk.sending', { defaultValue: 'Sending...' })
              : t('addNewAsk.sendRequest', { defaultValue: 'Send Request' })}
          </Button>
        </div>
      </form>

    </div>
  );
}

