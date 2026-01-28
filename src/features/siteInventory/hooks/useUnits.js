import { useState, useCallback } from 'react';
import { getUnitsList, createUnit } from '../api/siteInventoryApi';
import { showError, showSuccess } from '../../../utils/toast';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for fetching and managing units
 * @param {string|number} workspaceId - The ID of the selected workspace
 * @returns {Object} { units, unitOptions, isLoadingUnits, isCreatingUnit, error, refetch, createNewUnit }
 */
export const useUnits = (workspaceId) => {
  const { t } = useTranslation('siteInventory');
  const [units, setUnits] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch units list
   */
  const fetchUnits = useCallback(async () => {
    if (!workspaceId) {
      setUnits([]);
      setUnitOptions([]);
      setIsLoadingUnits(false);
      setError(null);
      return;
    }

    try {
      setIsLoadingUnits(true);
      setError(null);
      const response = await getUnitsList(workspaceId);

      // Handle different response structures
      // API response structure: { message: "...", unitTypes: [...] }
      let unitsArray = [];

      if (Array.isArray(response?.data?.unitTypes)) {
        unitsArray = response.data.unitTypes;
      } else if (Array.isArray(response?.unitTypes)) {
        unitsArray = response.unitTypes;
      } else if (Array.isArray(response?.data)) {
        unitsArray = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        unitsArray = response.data.data;
      } else if (Array.isArray(response)) {
        unitsArray = response;
      } else if (response?.data && typeof response.data === 'object') {
        unitsArray = response.data.data || Object.values(response.data).filter(Array.isArray)[0] || [];
      }

      setUnits(unitsArray);

      // Transform units to dropdown options format
      const options = unitsArray.map((unit) => ({
        value: (unit.id || unit._id || unit.unitId)?.toString() || '',
        label: unit.name || unit.unitName || unit.label || unit,
      }));

      setUnitOptions(options);
    } catch (err) {
      console.error('Error fetching units:', err);
      const errorMessage = err?.response?.data?.message ||
        err?.message ||
        t('addNewAsk.unitLoadFailed', { defaultValue: 'Failed to load units' });
      setError(errorMessage);
      showError(errorMessage);
      setUnits([]);
      setUnitOptions([]);
    } finally {
      setIsLoadingUnits(false);
    }
  }, [workspaceId, t]);

  /**
   * Create a new unit
   * @param {Object} unitData - Unit data
   * @param {string} unitData.name - Unit name
   * @returns {Promise<Object>} Created unit data
   */
  const createNewUnit = useCallback(async (unitData) => {
    if (!workspaceId) {
      const errorMsg = t('addNewAsk.workspaceRequired', { defaultValue: 'Please select a workspace first' });
      showError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setIsCreatingUnit(true);
      setError(null);

      const response = await createUnit({
        name: unitData.name || unitData.label,
        wsId: workspaceId,
      });

      // Get the created unit data
      const createdUnit = response?.data?.data || response?.data || unitData;

      // Add to units list
      const newUnit = {
        id: createdUnit.id || createdUnit._id,
        name: createdUnit.name || unitData.name || unitData.label,
      };

      setUnits((prev) => [...prev, newUnit]);

      // Add to options list
      const newOption = {
        value: newUnit.id || Date.now().toString(),
        label: newUnit.name,
      };

      setUnitOptions((prev) => [...prev, newOption]);

      showSuccess(t('addNewAsk.unitAdded', { defaultValue: 'Unit added successfully' }));

      return newOption;
    } catch (err) {
      console.error('Error creating unit:', err);
      const errorMessage = err?.response?.data?.message ||
        err?.message ||
        t('addNewAsk.unitAddFailed', { defaultValue: 'Failed to add unit' });
      setError(errorMessage);
      showError(errorMessage);
      throw err;
    } finally {
      setIsCreatingUnit(false);
    }
  }, [workspaceId, t]);

  return {
    units,
    unitOptions,
    isLoadingUnits,
    isCreatingUnit,
    error,
    refetch: fetchUnits,
    createNewUnit,
  };
};

export default useUnits;

