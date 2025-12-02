/**
 * Site Inventory API
 * API calls for site inventory management
 */

import http from '../../../services/http';
import { SITE_INVENTORY_ENDPOINTS_FLAT } from '../constants/siteInventoryEndpoints';

/**
 * Create site inventory item
 * @param {Object} data - Site inventory data
 * @param {string|number} data.materialsId - Material ID
 * @param {string|number} data.quantity - Quantity
 * @param {string|number} data.costPerUnit - Cost per unit
 * @param {string|number} data.totalPrice - Total price
 * @param {string|number} data.projectID - Project ID
 * @param {string|number} data.vendorID - Vendor ID
 * @param {string} data.Description - Description
 * @param {number} data.inventoryTypeId - Inventory type ID (1=Reusable, 2=Consumable)
 * @param {File[]} data.files - Array of files (photos/videos)
 * @param {string} [data.checkInDate] - Check in date (optional)
 * @param {string|number} [data.lowStockAlert] - Low stock alert (optional)
 * @returns {Promise<Object>} API response
 */
export const createSiteInventory = async (data) => {
  const formData = new FormData();

  // Append text fields
  if (data.materialsId) formData.append('materialsId', data.materialsId);
  if (data.quantity) formData.append('quantity', data.quantity);
  if (data.costPerUnit !== undefined && data.costPerUnit !== null) {
    formData.append('costPerUnit', data.costPerUnit);
  }
  if (data.totalPrice !== undefined && data.totalPrice !== null) {
    formData.append('totalPrice', data.totalPrice);
  }
  if (data.projectID) formData.append('projectID', data.projectID);
  if (data.vendorID) formData.append('vendorID', data.vendorID);
  if (data.Description !== undefined) formData.append('Description', data.Description || '');
  if (data.inventoryTypeId) formData.append('inventoryTypeId', data.inventoryTypeId);
  if (data.checkInDate) formData.append('checkInDate', data.checkInDate);
  if (data.lowStockAlert) formData.append('lowStockAlert', data.lowStockAlert);

  // Append files array
  if (data.files && Array.isArray(data.files) && data.files.length > 0) {
    data.files.forEach((file) => {
      if (file instanceof File) {
        formData.append('files', file);
      }
    });
  }

  return http.post(
    SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_CREATE,
    formData
  );
};

/**
 * Get site inventory item details
 * @param {string} id - Site inventory item ID
 * @returns {Promise<Object>} Site inventory data
 */
export const getSiteInventory = async (id) => {
  return http.get(`${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_GET}/${id}`);
};

/**
 * Update site inventory item
 * @param {string} id - Site inventory item ID
 * @param {Object} data - Site inventory data
 * @returns {Promise<Object>} API response
 */
export const updateSiteInventory = async (id, data) => {
  const formData = new FormData();

  // Append all fields from data
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return http.put(
    `${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_UPDATE}/${id}`,
    formData
  );
};

/**
 * Delete site inventory item
 * @param {string} id - Site inventory item ID
 * @returns {Promise<Object>} API response
 */
export const deleteSiteInventory = async (id) => {
  return http.delete(`${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_DELETE}/${id}`);
};

/**
 * Get list of site inventory items
 * @param {Object} [params] - Query parameters
 * @param {string|number} [params.projectID] - Project ID filter
 * @param {string|number} [params.inventoryTypeId] - Inventory type ID filter (1=Reusable, 2=Consumable)
 * @returns {Promise<Object>} List of site inventory items
 */
export const getSiteInventoryList = async (params = {}) => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.projectID) {
    queryParams.append('projectID', params.projectID);
  }
  
  if (params.inventoryTypeId) {
    queryParams.append('inventoryTypeId', params.inventoryTypeId);
  }
  
  const queryString = queryParams.toString();
  const url = queryString 
    ? `${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_LIST}?${queryString}`
    : SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_LIST;
  
  return http.get(url);
};

/**
 * Get list of materials
 * @param {string|number} workspaceId - Workspace ID
 * @returns {Promise<Object>} List of materials
 */
export const getMaterialsList = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }
  return http.get(`${SITE_INVENTORY_ENDPOINTS_FLAT.MATERIALS_LIST}/${workspaceId}`);
};

/**
 * Create new material
 * @param {Object} data - Material data (name, type, etc.)
 * @returns {Promise<Object>} API response
 */
export const createMaterial = async (data) => {
  return http.post(SITE_INVENTORY_ENDPOINTS_FLAT.MATERIALS_CREATE, data);
};

/**
 * Get list of units
 * @param {string|number} workspaceId - Workspace ID
 * @returns {Promise<Object>} List of units
 */
export const getUnitsList = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required');
  }
  return http.get(`${SITE_INVENTORY_ENDPOINTS_FLAT.UNITS_LIST}/${workspaceId}`);
};

/**
 * Create new unit
 * @param {Object} data - Unit data
 * @param {string} data.name - Unit name
 * @param {string|number} data.wsId - Workspace ID
 * @returns {Promise<Object>} API response
 */
export const createUnit = async (data) => {
  // Ensure data is sent as JSON (not FormData)
  const payload = {
    name: data.name,
    wsId: data.wsId,
  };
  return http.post(SITE_INVENTORY_ENDPOINTS_FLAT.UNITS_CREATE, payload);
};

/**
 * Get list of vendors
 * @returns {Promise<Object>} List of vendors
 */
export const getVendorsList = async () => {
  return http.get(SITE_INVENTORY_ENDPOINTS_FLAT.VENDORS_LIST);
};

/**
 * Create new vendor
 * @param {Object} data - Vendor data (name, countryCode, contactNumber)
 * @returns {Promise<Object>} API response
 */
export const createVendor = async (data) => {
  return http.post(SITE_INVENTORY_ENDPOINTS_FLAT.VENDORS_CREATE, data);
};

/**
 * Get transfer requests
 * @param {Object} [params] - Query parameters
 * @param {string} [params.scope] - Request scope ('incoming' or 'outgoing')
 * @param {string|number} [params.projectID] - Project ID filter
 * @returns {Promise<Object>} List of transfer requests
 */
export const getTransferRequests = async (params = {}) => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.scope) {
    queryParams.append('scope', params.scope);
  }
  
  if (params.projectID) {
    queryParams.append('projectID', params.projectID);
  }
  
  const queryString = queryParams.toString();
  const url = queryString 
    ? `${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_TRANSFER_REQUESTS}?${queryString}`
    : SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_TRANSFER_REQUESTS;
  
  return http.get(url);
};

/**
 * Approve transfer request
 * @param {string|number} workspaceID - Workspace ID
 * @param {Object} data - Approval data
 * @param {string|number} data.costPerUnit - Cost per unit
 * @param {string|number} [data.quantity] - Approved quantity (optional)
 * @param {string|number} [data.totalPrice] - Total price (optional)
 * @returns {Promise<Object>} API response
 */
export const approveTransferRequest = async (workspaceID, data) => {
  if (!workspaceID) {
    throw new Error('Workspace ID is required');
  }
  
  const payload = {
    costPerUnit: data.costPerUnit,
  };
  
  // Add optional fields if provided
  if (data.quantity !== undefined) {
    payload.quantity = data.quantity;
  }
  
  if (data.totalPrice !== undefined) {
    payload.totalPrice = data.totalPrice;
  }
  
  return http.post(
    `${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_TRANSFER_APPROVE}/${workspaceID}`,
    payload
  );
};

/**
 * Reject transfer request
 * @param {string|number} workspaceID - Workspace ID
 * @param {Object} data - Rejection data
 * @param {string} data.reason - Rejection reason (text)
 * @param {string} data.rejectionType - Rejection type ('text', 'audio', or 'both')
 * @param {File} [data.audioFile] - Audio file (optional, required if rejectionType is 'audio' or 'both')
 * @returns {Promise<Object>} API response
 */
export const rejectTransferRequest = async (workspaceID, data) => {
  if (!workspaceID) {
    throw new Error('Workspace ID is required');
  }
  
  const formData = new FormData();
  
  formData.append('reason', data.reason || '');
  formData.append('rejectionType', data.rejectionType || 'text');
  
  // Append audio file if provided
  if (data.audioFile && data.audioFile instanceof File) {
    formData.append('audioFile', data.audioFile);
  }
  
  return http.post(
    `${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_TRANSFER_REJECT}/${workspaceID}`,
    formData
  );
};

/**
 * Get ask material requests
 * @param {Object} [params] - Query parameters
 * @param {string|number} [params.projectID] - Project ID filter
 * @returns {Promise<Object>} List of ask material requests
 */
export const getAskMaterialRequests = async (params = {}) => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.projectID) {
    queryParams.append('projectID', params.projectID);
  }
  
  const queryString = queryParams.toString();
  const url = queryString 
    ? `${SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_ASK_MATERIAL_REQUESTS}?${queryString}`
    : SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_ASK_MATERIAL_REQUESTS;
  
  return http.get(url);
};

/**
 * Request material (Add New Ask)
 * @param {Object} data - Request material data
 * @param {string|number} data.inventoryId - Inventory item ID
 * @param {string|number} data.quantity - Requested quantity
 * @param {string} data.description - Description
 * @param {string|number} data.fromProjectId - Source project ID
 * @param {Array<string|number>} data.toProjects - Array of destination project IDs
 * @returns {Promise<Object>} API response
 */
export const requestMaterial = async (data) => {
  const payload = {
    inventoryId: data.inventoryId,
    quantity: data.quantity,
    description: data.description || '',
    fromProjectId: data.fromProjectId,
    toProjects: Array.isArray(data.toProjects) ? data.toProjects : [],
  };
  
  return http.post(
    SITE_INVENTORY_ENDPOINTS_FLAT.SITE_INVENTORY_REQUEST_MATERIAL,
    payload
  );
};

