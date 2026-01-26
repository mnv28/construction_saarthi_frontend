/**
 * Past Project API
 * API functions for past project operations
 */

import axios from 'axios';
import http from '../../../services/http';
import config from '../../../config';
import { PAST_PROJECT_ENDPOINTS_FLAT } from '../constants/pastProjectEndpoints';

/**
 * Get past projects for a workspace
 * @param {string|number} workspaceId - Workspace ID (required)
 * @param {Object} filters - Optional filters (projectKey, name, status, address)
 * @returns {Promise<Array>} Array of past projects
 */
export const getPastProjects = async (workspaceId, filters = {}) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

  const url = `${config.API_BASE_URL}${PAST_PROJECT_ENDPOINTS_FLAT.PAST_PROJECT_LIST}/${workspaceId}`;
  const token = localStorage.getItem('token');

  try {
    // Check if filters are provided
    const hasFilters = filters.projectKey || filters.name || filters.status || filters.address;

    // Use axios.request for GET with body (non-standard but as per API example)
    const response = await axios.request({
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'text/plain',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      // Include body if filters are provided
      ...(hasFilters && {
        data: JSON.stringify({
          projectKey: filters.projectKey,
          name: filters.name,
          status: filters.status,
          address: filters.address,
        }),
      }),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Start a new past project - gets projectKey
 * @param {string|number} workspaceId - Workspace ID
 * @returns {Promise<Object>} Response containing projectKey
 */
export const startPastProject = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

  const url = `${config.API_BASE_URL}${PAST_PROJECT_ENDPOINTS_FLAT.PAST_PROJECT_START}/${workspaceId}`;
  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a past project
 * @param {string|number} workspaceId - Workspace ID
 * @param {Object} data - Project data
 * @param {string} data.projectKey - Project key from start API
 * @param {string} data.name - Project name
 * @param {string} data.address - Project address
 * @returns {Promise<Object>} Created project
 */
export const createPastProject = async (workspaceId, data) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }

  if (!data.projectKey || !data.name || !data.address) {
    throw new Error('Project key, name, and address are required');
  }

  const url = `${config.API_BASE_URL}${PAST_PROJECT_ENDPOINTS_FLAT.PAST_PROJECT_CREATE}/${workspaceId}`;
  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      url,
      {
        projectKey: data.projectKey,
        name: data.name,
        address: data.address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get past project by ID
 * @param {string|number} projectId - Project ID
 * @returns {Promise<Object>} Project details with pastWorkMedia
 */
export const getPastProjectById = async (projectId, workspaceId = null) => {
  if (!projectId) {
    throw new Error('Project ID is required');
  }

  const url = `${config.API_BASE_URL}${PAST_PROJECT_ENDPOINTS_FLAT.PAST_PROJECT_GET_BY_ID}/${projectId}`;
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const projectData = response.data?.data || response.data;
    if (projectData) return projectData;

    throw new Error('Project not found');
  } catch (error) {
    // Fallback: If detail fetch fails and we have workspaceId, try to find in list
    if (workspaceId && (error.response?.status === 404 || error.response?.status === 500)) {
      try {
        const allPastProjects = await getPastProjects(workspaceId);
        const project = allPastProjects.find(p =>
          String(p.id) === String(projectId) ||
          String(p.projectKey) === String(projectId) ||
          String(p._id) === String(projectId)
        );

        if (project) return project;
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
    }

    throw error;
  }
};

/**
 * Update a past project
 * @param {string|number} projectId - Project ID
 * @param {Object} data - Project data to update
 * @param {string} data.name - Project name
 * @param {string} data.address - Project address
 * @param {string} data.projectKey - Optional project key (if available)
 * @param {string|number} workspaceId - Optional workspace ID (if needed by API)
 * @returns {Promise<Object>} Updated project
 */
export const updatePastProject = async (projectId, data, workspaceId = null) => {
  if (!projectId) {
    throw new Error('Project ID is required');
  }

  const token = localStorage.getItem('token');
  const url = `${config.API_BASE_URL}${PAST_PROJECT_ENDPOINTS_FLAT.PAST_PROJECT_UPDATE}/${projectId}`;

  try {
    // ALWAYS use FormData because the backend error 'files is not iterable' suggests 
    // it expects a multipart request to process file logic, even if no new files are being added.
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    if (data.projectKey) formData.append('projectKey', data.projectKey);
    if (workspaceId) formData.append('workspaceId', workspaceId);

    // Append any new files to the 'files' key as demonstrated in working Postman request.
    if (data.files && Array.isArray(data.files)) {
      data.files.forEach((file) => {
        const fileToAppend = file instanceof File ? file : (file.file instanceof File ? file.file : null);
        if (fileToAppend) {
          formData.append('files', fileToAppend);
        }
      });
    }

    const response = await axios.put(url, formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // axios will correctly set multipart/form-data boundary
      }
    });

    return response.data;
  } catch (error) {
    console.error('API Update Error:', error.response?.data || error.message);

    const errorData = error.response?.data;
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      (typeof errorData === 'string' ? errorData : null) ||
      error.message ||
      'Failed to update project';

    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    throw enhancedError;
  }
};

/**
 * Upload media files for a past project
 * @param {string} projectKey - Project key
 * @param {File[]} files - Array of File objects to upload
 * @returns {Promise<Object>} Upload response
 */
export const uploadPastProjectMedia = async (projectKey, files) => {
  if (!projectKey) {
    throw new Error('Project key is required');
  }

  if (!files || files.length === 0) {
    throw new Error('At least one file is required');
  }

  const formData = new FormData();

  // Add projectKey to formData
  formData.append('projectKey', projectKey);

  // Add all files with key 'media'
  files.forEach((file) => {
    if (file instanceof File) {
      formData.append('media', file);
    } else if (file && file.file && file.file instanceof File) {
      formData.append('media', file.file);
    }
  });

  const url = `${config.API_BASE_URL}${PAST_PROJECT_ENDPOINTS_FLAT.PAST_PROJECT_UPLOAD}`;
  const token = localStorage.getItem('token');

  try {
    // Don't set Content-Type manually - axios will set it with the correct boundary for multipart/form-data
    const response = await axios.post(
      url,
      formData,
      {
        headers: {
          // Let axios set Content-Type with boundary automatically
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        timeout: 300000, // 5 minutes timeout for file uploads
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


