/**
 * Finance Feature API Endpoints
 * All finance-related endpoints
 */

export const FINANCE_ENDPOINTS = {
  EXPENSE_SECTION: {
    LIST: '/expense-section', // GET /api/expense-section
    CREATE: '/expense-section/create', // POST /api/expense-section/create
    UPDATE: '/expense-section/update', // PUT /api/expense-section/update/{id}
    DELETE: '/expense-section/delete', // DELETE /api/expense-section/delete/{id}
  },
  PAYABLE_BILL: {
    GET: '/payable-bill/get', // GET /api/payable-bill/get
    CREATE: '/payable-bill/create', // POST /api/payable-bill/create
    UPDATE: '/payable-bill/update', // PUT /api/payable-bill/update/{id}
  },
  BUILDER_INVOICES_SECTION: {
    CREATE: '/builder-invoices-section', // POST /api/builder-invoices-section
    LIST: '/builder-invoices-section/section', // POST /api/builder-invoices-section/section
    UPDATE_SECTION: '/builder-invoices-section/section', // PUT /api/builder-invoices-section/section/{id}
    DELETE_SECTION: '/builder-invoices-section/section', // DELETE /api/builder-invoices-section/section/{id}
    INVOICES: '/builder-invoices-section/section/invoices', // POST /api/builder-invoices-section/section/invoices?section_id=1
    CREATE_INVOICE: '/builder-invoices-section/invoice', // POST /api/builder-invoices-section/invoice
    UPDATE_INVOICE: '/builder-invoices-section/invoice', // PUT /api/builder-invoices-section/invoice/{id}
    DELETE_INVOICE: '/builder-invoices-section/invoice', // DELETE /api/builder-invoices-section/invoice/{id}
    GET_ESTIMATED_BUDGET: '/builder-invoices-section/project/estimated-budget', // GET /api/builder-invoices-section/project/estimated-budget/{projectId}
    UPDATE_ESTIMATED_BUDGET: '/builder-invoices-section/project/estimated-budget', // PUT /api/builder-invoices-section/project/estimated-budget/{projectId}
  },
};

// Flattened endpoints for easier access
export const FINANCE_ENDPOINTS_FLAT = {
  EXPENSE_SECTION_LIST: FINANCE_ENDPOINTS.EXPENSE_SECTION.LIST,
  EXPENSE_SECTION_CREATE: FINANCE_ENDPOINTS.EXPENSE_SECTION.CREATE,
  EXPENSE_SECTION_UPDATE: FINANCE_ENDPOINTS.EXPENSE_SECTION.UPDATE,
  EXPENSE_SECTION_DELETE: FINANCE_ENDPOINTS.EXPENSE_SECTION.DELETE,
  PAYABLE_BILL_GET: FINANCE_ENDPOINTS.PAYABLE_BILL.GET,
  PAYABLE_BILL_CREATE: FINANCE_ENDPOINTS.PAYABLE_BILL.CREATE,
  PAYABLE_BILL_UPDATE: FINANCE_ENDPOINTS.PAYABLE_BILL.UPDATE,
  BUILDER_INVOICES_SECTION_CREATE: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.CREATE,
  BUILDER_INVOICES_SECTION_LIST: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.LIST,
  BUILDER_INVOICES_SECTION_UPDATE_SECTION: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.UPDATE_SECTION,
  BUILDER_INVOICES_SECTION_DELETE_SECTION: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.DELETE_SECTION,
  BUILDER_INVOICES_SECTION_INVOICES: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.INVOICES,
  BUILDER_INVOICES_SECTION_CREATE_INVOICE: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.CREATE_INVOICE,
  BUILDER_INVOICES_SECTION_UPDATE_INVOICE: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.UPDATE_INVOICE,
  BUILDER_INVOICES_SECTION_DELETE_INVOICE: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.DELETE_INVOICE,
  BUILDER_INVOICES_SECTION_GET_ESTIMATED_BUDGET: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.GET_ESTIMATED_BUDGET,
  BUILDER_INVOICES_SECTION_UPDATE_ESTIMATED_BUDGET: FINANCE_ENDPOINTS.BUILDER_INVOICES_SECTION.UPDATE_ESTIMATED_BUDGET,
};

export default FINANCE_ENDPOINTS_FLAT;

