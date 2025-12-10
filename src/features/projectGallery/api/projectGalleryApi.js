/**
 * Project Gallery API
 * API functions for project gallery operations
 */

import http from '../../../services/http';
import { PROJECT_GALLERY_ENDPOINTS_FLAT } from '../constants';

/**
 * Get project gallery items
 * @param {Object} params - Query parameters
 * @param {string} params.projectId - Project ID
 * @returns {Promise} API response
 */
export const getProjectGallery = async (params = {}) => {
  try {
    const response = await http.get(PROJECT_GALLERY_ENDPOINTS_FLAT.GET_GALLERY, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project gallery:', error);
    throw error;
  }
};

/**
 * Upload image to project gallery
 * @param {Object} data - Upload data
 * @param {string} data.projectId - Project ID
 * @param {File} data.file - Image file
 * @param {string} data.title - Image title (optional)
 * @param {string} data.description - Image description (optional)
 * @returns {Promise} API response
 */
export const uploadGalleryImage = async (data) => {
  try {
    const formData = new FormData();
    formData.append('projectId', data.projectId);
    formData.append('file', data.file);
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);

    const response = await http.post(
      PROJECT_GALLERY_ENDPOINTS_FLAT.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
};

/**
 * Delete gallery image
 * @param {string} imageId - Image ID
 * @returns {Promise} API response
 */
export const deleteGalleryImage = async (imageId) => {
  try {
    const response = await http.delete(
      PROJECT_GALLERY_ENDPOINTS_FLAT.DELETE_IMAGE.replace(':id', imageId)
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};

/**
 * Update gallery image details
 * @param {string} imageId - Image ID
 * @param {Object} data - Update data
 * @param {string} data.title - Image title (optional)
 * @param {string} data.description - Image description (optional)
 * @returns {Promise} API response
 */
export const updateGalleryImage = async (imageId, data) => {
  try {
    const response = await http.put(
      PROJECT_GALLERY_ENDPOINTS_FLAT.UPDATE_IMAGE.replace(':id', imageId),
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
};

