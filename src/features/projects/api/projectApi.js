/**
 * Projects API
 * API calls for projects
 */

import http from '../../../services/http';
import { PROJECT_ENDPOINTS_FLAT } from '../constants/projectEndpoints';

/**
 * Get Projects List
 * @param {Object} [params] - Query parameters
 * @param {string} [params.search] - Search query
 * @param {string} [params.status] - Filter by status
 * @returns {Promise<Object>} API response
 */
export const getProjects = async (params = {}) => {
  const response = await http.get(PROJECT_ENDPOINTS_FLAT.PROJECT_LIST, { params });
  return response;
};

/**
 * Get Project Details
 * @param {string|number} projectId - Project ID
 * @returns {Promise<Object>} API response
 */
export const getProjectDetails = async (projectId) => {
  const response = await http.get(`${PROJECT_ENDPOINTS_FLAT.PROJECT_DETAILS}/${projectId}`);
  return response;
};

/**
 * Create Project
 * @param {Object} data - Project data
 * @returns {Promise<Object>} API response
 */
export const createProject = async (data) => {
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'profile_photo' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  const response = await http.post(PROJECT_ENDPOINTS_FLAT.PROJECT_CREATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Update Project
 * @param {string|number} projectId - Project ID
 * @param {Object} data - Project data
 * @returns {Promise<Object>} API response
 */
export const updateProject = async (projectId, data) => {
  const formData = new FormData();
  
  // Append all fields to FormData
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (key === 'profile_photo' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  const response = await http.put(`${PROJECT_ENDPOINTS_FLAT.PROJECT_UPDATE}/${projectId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

/**
 * Delete Project
 * @param {string|number} projectId - Project ID
 * @returns {Promise<Object>} API response
 */
export const deleteProject = async (projectId) => {
  const response = await http.delete(`${PROJECT_ENDPOINTS_FLAT.PROJECT_DELETE}/${projectId}`);
  return response;
};

/**
 * Get Builders List
 * @returns {Promise<Object>} API response
 */
export const getBuilders = async () => {
  const response = await http.get(PROJECT_ENDPOINTS_FLAT.BUILDER_LIST);
  return response;
};

/**
 * Create Builder
 * @param {Object} data - Builder data
 * @returns {Promise<Object>} API response
 */
export const createBuilder = async (data) => {
  const response = await http.post(PROJECT_ENDPOINTS_FLAT.BUILDER_CREATE, data);
  return response;
};

