import { useState, useCallback } from 'react';
import { getMaterialsList, createMaterial } from '../api/siteInventoryApi';
import { showError, showSuccess } from '../../../utils/toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for fetching and managing materials
 * @returns {Object} { materials, materialOptions, isLoadingMaterials, isCreatingMaterial, error, refetch, createNewMaterial }
 */
export const useMaterials = () => {
  const { t } = useTranslation('siteInventory');
  const { selectedWorkspace } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch materials list
   */
  const fetchMaterials = useCallback(async () => {
    if (!selectedWorkspace) {
      console.warn('No workspace selected');
      setMaterials([]);
      setMaterialOptions([]);
      setIsLoadingMaterials(false);
      return;
    }

    try {
      setIsLoadingMaterials(true);
      setError(null);
      const response = await getMaterialsList(selectedWorkspace);
      
      // Handle different response structures
      let materialsArray = [];
      
      if (Array.isArray(response?.data)) {
        materialsArray = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        materialsArray = response.data.data;
      } else if (Array.isArray(response)) {
        materialsArray = response;
      } else if (response?.data && typeof response.data === 'object') {
        materialsArray = response.data.data || Object.values(response.data).filter(Array.isArray)[0] || [];
      }
      
      setMaterials(materialsArray);
      
      // Transform materials to dropdown options format
      const options = materialsArray.map((material) => ({
        value: material.id || material._id || material.materialId,
        label: material.name || material.materialName || material.label,
      }));
      
      setMaterialOptions(options);
    } catch (err) {
      console.error('Error fetching materials:', err);
      const errorMessage = err?.response?.data?.message ||
        err?.message ||
        t('addNewAsk.materialLoadFailed', { defaultValue: 'Failed to load materials' });
      setError(errorMessage);
      showError(errorMessage);
      setMaterials([]);
      setMaterialOptions([]);
    } finally {
      setIsLoadingMaterials(false);
    }
  }, [selectedWorkspace, t]);

  /**
   * Create a new material
   * @param {Object} materialData - Material data
   * @param {string} materialData.name - Material name
   * @param {string} materialData.type - Material type ('reusable' or 'consumable')
   * @param {string} materialData.unit - Unit name
   * @param {string|number} materialData.unitId - Unit ID
   * @returns {Promise<Object>} Created material data
   */
  const createNewMaterial = useCallback(async (materialData) => {
    try {
      setIsCreatingMaterial(true);
      setError(null);
      
      const response = await createMaterial({
        name: materialData.name || materialData.label,
        type: materialData.type, // 'reusable' or 'consumable'
        unit: materialData.unit,
        unitId: materialData.unitId,
      });
      
      // Get the created material data
      // API response structure: { message: "...", material: { id, name, unitId, ... } }
      const createdMaterial = response?.data?.material || response?.material || response?.data?.data || response?.data || materialData;
      
      // Add to materials list
      // API response only contains unitId, not unit name
      const newMaterial = {
        id: createdMaterial.id || createdMaterial._id,
        name: createdMaterial.name || materialData.name || materialData.label,
        type: createdMaterial.inventoryTypeId || materialData.type,
        unitId: createdMaterial.unitId || materialData.unitId,
      };
      
      setMaterials((prev) => [...prev, newMaterial]);
      
      // Add to options list
      const newOption = {
        value: newMaterial.id || Date.now().toString(),
        label: newMaterial.name,
      };
      
      setMaterialOptions((prev) => [...prev, newOption]);
      
      showSuccess(t('addNewAsk.materialAdded', { defaultValue: 'Material added successfully' }));
      
      return newOption;
    } catch (err) {
      console.error('Error creating material:', err);
      const errorMessage = err?.response?.data?.message ||
        err?.message ||
        t('addNewAsk.materialAddFailed', { defaultValue: 'Failed to add material' });
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsCreatingMaterial(false);
    }
  }, [t]);

  return {
    materials,
    materialOptions,
    isLoadingMaterials,
    isCreatingMaterial,
    error,
    refetch: fetchMaterials,
    createNewMaterial,
  };
};

export default useMaterials;

