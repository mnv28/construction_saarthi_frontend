import { useState, useEffect, useCallback, useRef } from 'react';
import { getExpenseSections, createExpenseSection, updateExpenseSection, deleteExpenseSection } from '../api';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for fetching and managing expense sections
 * @param {string|number} projectId - The ID of the project
 * @returns {Object} { sections, isLoading, isCreating, isUpdating, isDeleting, error, refetch, createSection, updateSection, deleteSection }
 */
export const useExpenseSections = (projectId) => {
  const { t } = useTranslation('finance');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchSections = useCallback(async () => {
    if (!projectId) {
      setSections([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Prevent duplicate API calls
    if (isFetchingRef.current) {
      console.log("Already fetching expense sections, skipping duplicate call");
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      const response = await getExpenseSections(projectId);

      // Handle different response structures
      const sectionsData = response?.data || response?.sections || response || [];
      const sectionsList = Array.isArray(sectionsData) ? sectionsData : [];

      // Transform API response to match component structure
      const transformedSections = sectionsList.map((section) => ({
        id: section.id || section.section_id || section.expense_section_id,
        name: section.name || section.section_name || 'Untitled Section',
      }));

      setSections(transformedSections);
    } catch (err) {
      console.error('Error fetching expense sections:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        t('failedToLoadSections', { defaultValue: 'Failed to load sections' });
      setError(errorMessage);
      setSections([]);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [projectId, t]);

  const createSection = useCallback(
    async (sectionName, workspaceId) => {
      if (!sectionName || !workspaceId || !projectId) {
        const errorMessage = t('missingRequiredFields', {
          defaultValue: 'Name, workspace, and project are required',
        });
        setError(errorMessage);
        return null;
      }

      try {
        setIsCreating(true);
        setError(null);
        const response = await createExpenseSection({
          name: sectionName,
          workspace_id: workspaceId,
          project_id: projectId,
        });

        // Handle different response structures
        const createdSection = response?.data || response || {};
        const newSection = {
          id:
            createdSection.id ||
            createdSection.section_id ||
            createdSection.expense_section_id,
          name: createdSection.name || sectionName,
        };

        // Add to sections list
        setSections((prev) => [...prev, newSection]);

        return newSection;
      } catch (err) {
        console.error('Error creating expense section:', err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          t('failedToCreateSection', {
            defaultValue: 'Failed to create section',
          });
        setError(errorMessage);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [projectId, t]
  );

  const updateSection = useCallback(
    async (sectionId, sectionName) => {
      if (!sectionId || !sectionName) {
        const errorMessage = t('missingRequiredFields', {
          defaultValue: 'Section ID and name are required',
        });
        setError(errorMessage);
        return null;
      }

      try {
        setIsUpdating(true);
        setError(null);
        
        // Convert sectionId to string for API call
        const sectionIdStr = String(sectionId);
        console.log('Calling updateExpenseSection API:', { sectionId: sectionIdStr, name: sectionName });
        const response = await updateExpenseSection(sectionIdStr, {
          name: sectionName,
        });
        console.log('Update API response:', response);

        // Handle different response structures
        const updatedSection = response?.data || response || {};
        const updated = {
          id: updatedSection.id || sectionId,
          name: updatedSection.name || sectionName,
        };

        // Update section in list - handle both string and number IDs
        setSections((prev) =>
          prev.map((section) => {
            const sectionIdMatch = String(section.id) === String(sectionId) || section.id === sectionId;
            return sectionIdMatch ? updated : section;
          })
        );

        return updated;
      } catch (err) {
        console.error('Error updating expense section:', err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          t('failedToUpdateSection', {
            defaultValue: 'Failed to update section',
          });
        setError(errorMessage);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [t]
  );

  const deleteSection = useCallback(
    async (sectionId) => {
      if (!sectionId) {
        const errorMessage = t('missingRequiredFields', {
          defaultValue: 'Section ID is required',
        });
        setError(errorMessage);
        return false;
      }

      try {
        setIsDeleting(true);
        setError(null);
        
        // Convert sectionId to string for API call
        const sectionIdStr = String(sectionId);
        console.log('Calling deleteExpenseSection API:', { sectionId: sectionIdStr });
        const response = await deleteExpenseSection(sectionIdStr);
        console.log('Delete API response:', response);

        // Remove section from list - handle both string and number IDs
        setSections((prev) => 
          prev.filter((section) => {
            const sectionIdMatch = String(section.id) === String(sectionId) || section.id === sectionId;
            return !sectionIdMatch;
          })
        );

        return true;
      } catch (err) {
        console.error('Error deleting expense section:', err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          t('failedToDeleteSection', {
            defaultValue: 'Failed to delete section',
          });
        setError(errorMessage);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return {
    sections,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    refetch: fetchSections,
    createSection,
    updateSection,
    deleteSection,
  };
};

export default useExpenseSections;

