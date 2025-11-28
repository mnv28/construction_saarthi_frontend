/**
 * Projects Feature API Endpoints
 * All project-related endpoints
 */

export const PROJECT_ENDPOINTS = {
  // Project Endpoints
  PROJECT: {
    LIST: '/project',
    CREATE: '/project',
    UPDATE: '/project/update',
    DELETE: '/project/delete',
    DETAILS: '/project/details',
    SEARCH: '/project/search',
  },

  // Builder Endpoints (for dropdown)
  BUILDER: {
    LIST: '/builder',
    CREATE: '/builder',
  },
};

// Flattened endpoints for easier access
export const PROJECT_ENDPOINTS_FLAT = {
  // Project
  PROJECT_LIST: PROJECT_ENDPOINTS.PROJECT.LIST,
  PROJECT_CREATE: PROJECT_ENDPOINTS.PROJECT.CREATE,
  PROJECT_UPDATE: PROJECT_ENDPOINTS.PROJECT.UPDATE,
  PROJECT_DELETE: PROJECT_ENDPOINTS.PROJECT.DELETE,
  PROJECT_DETAILS: PROJECT_ENDPOINTS.PROJECT.DETAILS,
  PROJECT_SEARCH: PROJECT_ENDPOINTS.PROJECT.SEARCH,

  // Builder
  BUILDER_LIST: PROJECT_ENDPOINTS.BUILDER.LIST,
  BUILDER_CREATE: PROJECT_ENDPOINTS.BUILDER.CREATE,
};

export default PROJECT_ENDPOINTS_FLAT;

