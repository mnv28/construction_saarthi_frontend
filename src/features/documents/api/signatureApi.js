/**
 * Signature API
 * API calls for document signatures
 */

import http from '../../../services/http';
import axios from 'axios';
import config from '../../../config';

/**
 * Get signatures for a specific document
 * @param {string|number} projectId - Project ID
 * @param {string|number} documentId - Document ID
 * @returns {Promise<Object>} Signatures response
 */
export const getDocumentSignatures = async (projectId, documentId) => {
  if (!projectId || !documentId) {
    throw new Error('Project ID and Document ID are required');
  }

  const response = await http.get(`/project/signatures/${projectId}/${documentId}`);

  return response?.data || response || {};
};

/**
 * Upload signature for a document
 * @param {Object} data - Signature data
 * @param {string|number} data.projectId - Project ID
 * @param {string|number} data.documentId - Document ID
 * @param {string} data.signatureType - Type of signature ('contractor' or 'client')
 * @param {string} data.signatureImage - Base64 signature image data
 * @returns {Promise<Object>} Upload response
 */
export const uploadDocumentSignature = async (data) => {
  if (!data.projectId || !data.documentId) {
    throw new Error('Project ID and Document ID are required');
  }

  if (!data.signatureType || !data.signatureImage) {
    throw new Error('Signature type and image are required');
  }

  if (!data.promptId) {
    throw new Error('Prompt ID is required');
  }

  const formData = new FormData();
  formData.append('projectId', data.projectId);
  formData.append('documentId', data.documentId);
  formData.append('promptId', data.promptId);
  formData.append('signatureKey', `${data.signatureType}_signature`);
  
  // Convert base64 to blob for FormData
  const base64Data = data.signatureImage.replace(/^data:image\/png;base64,/, '');
  const blob = await fetch(`data:image/png;base64,${base64Data}`).then(res => res.blob());
  formData.append('signature', blob, 'signature.png');

  // Debug: Log FormData contents
  console.log('Uploading signature with data:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Use axios directly with FormData
  const token = localStorage.getItem('token');

  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/project/signature/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Signature upload error:', error.response?.data || error.message);
    throw error;
  }
};
