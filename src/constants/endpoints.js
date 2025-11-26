/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all API calls
 * Organized by feature modules for scalability (400+ pages)
 */

export const ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    SEND_OTP: '/user/send-otp',
    VERIFY_OTP: '/user/verify-otp',
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    LOGOUT: '/user/logout',
    REFRESH_TOKEN: '/user/refresh-token',
    LANGUAGE: '/user/language',
  },

  // Workspace Endpoints
  WORKSPACE: {
    LIST: '/workspace',
    CREATE: '/workspace',
    UPDATE: '/workspace/update',
    DELETE: '/workspace/delete',
    DETAILS: '/workspace/details',
    MEMBERS: '/workspace/member', // Base path for workspace members
  },

  // Member Endpoints
  MEMBER: {
    ADD: '/workspace/addmember',
    UPDATE: '/member/update',
    DELETE: '/member/delete',
    LIST: '/member/list',
  },

  // Admin Endpoints
  ADMIN: {
    GET_ALL_ROLE: '/admin/getAllRole',
  },
};

// Flattened endpoints for easier access
export const ENDPOINTS_FLAT = {
  // Auth
  SEND_OTP: ENDPOINTS.AUTH.SEND_OTP,
  VERIFY_OTP: ENDPOINTS.AUTH.VERIFY_OTP,
  LOGIN: ENDPOINTS.AUTH.LOGIN,
  REGISTER: ENDPOINTS.AUTH.REGISTER,
  LOGOUT: ENDPOINTS.AUTH.LOGOUT,
  REFRESH_TOKEN: ENDPOINTS.AUTH.REFRESH_TOKEN,
  LANGUAGE: ENDPOINTS.AUTH.LANGUAGE,

  // Workspace
  WORKSPACE_LIST: ENDPOINTS.WORKSPACE.LIST,
  WORKSPACE_CREATE: ENDPOINTS.WORKSPACE.CREATE,
  WORKSPACE_UPDATE: ENDPOINTS.WORKSPACE.UPDATE,
  WORKSPACE_DELETE: ENDPOINTS.WORKSPACE.DELETE,
  WORKSPACE_DETAILS: ENDPOINTS.WORKSPACE.DETAILS,
  WORKSPACE_MEMBERS: ENDPOINTS.WORKSPACE.MEMBERS,

  // Member
  MEMBER_ADD: ENDPOINTS.MEMBER.ADD,
  MEMBER_UPDATE: ENDPOINTS.MEMBER.UPDATE,
  MEMBER_DELETE: ENDPOINTS.MEMBER.DELETE,
  MEMBER_LIST: ENDPOINTS.MEMBER.LIST,

  // Admin
  ADMIN_GET_ALL_ROLE: ENDPOINTS.ADMIN.GET_ALL_ROLE,
};

export default ENDPOINTS_FLAT;
