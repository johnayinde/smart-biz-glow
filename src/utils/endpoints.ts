// NestJS Backend API Endpoints Documentation

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Client management endpoints
  CLIENTS: {
    LIST: "/clients",
    GET: (id: string) => `/clients/${id}`,
    CREATE: "/clients",
    UPDATE: (id: string) => `/clients/${id}`,
    DELETE: (id: string) => `/clients/${id}`,
  },

  // Invoice management endpoints
  INVOICES: {
    LIST: "/invoices",
    GET: (id: string) => `/invoices/${id}`,
    CREATE: "/invoices",
    UPDATE: (id: string) => `/invoices/${id}`,
    DELETE: (id: string) => `/invoices/${id}`,
    MARK_PAID: (id: string) => `/invoices/${id}/mark-paid`,
    DOWNLOAD: (id: string) => `/invoices/${id}/download`,
  },

  // Invoice templates endpoints
  TEMPLATES: {
    LIST: "/templates",
    GET: (id: string) => `/templates/${id}`,
    CREATE: "/templates",
    UPDATE: (id: string) => `/templates/${id}`,
    DELETE: (id: string) => `/templates/${id}`,
    DUPLICATE: (id: string) => `/templates/${id}/duplicate`,
    SET_DEFAULT: (id: string) => `/templates/${id}/set-default`,
  },
  // Payment management endpoints
  PAYMENTS: {
    LIST: "/payments",
    GET: (id: string) => `/payments/${id}`,
    CREATE: "/payments",
    UPDATE: (id: string) => `/payments/${id}`,
    DELETE: (id: string) => `/payments/${id}`,
    STATS: "/payments/stats",
  },

  // Subscription management endpoints
  SUBSCRIPTIONS: {
    CHECK: "/subscriptions/check",
    CHECKOUT: "/subscriptions/checkout",
    CUSTOMER_PORTAL: "/subscriptions/customer-portal",
    CANCEL: "/subscriptions/cancel",
    HISTORY: "/subscriptions/history",
  },

  // Analytics endpoints
  ANALYTICS: {
    DASHBOARD_STATS: "/analytics/dashboard-stats",
    DATA: "/analytics/data",
    INSIGHTS: "/analytics/insights",
    EXPORT: "/analytics/export",
  },
};

// Expected request/response interfaces for NestJS backend

/*
POST /auth/login
Request: { email: string, password: string }
Response: { user: User, access_token: string, refresh_token: string }

POST /auth/signup
Request: { email: string, password: string, full_name: string }
Response: { user: User, access_token: string, refresh_token: string }

GET /auth/me
Headers: { Authorization: Bearer <token> }
Response: User

POST /clients
Request: CreateClientData
Response: Client

GET /clients
Response: Client[]

POST /invoices
Request: CreateInvoiceData
Response: Invoice

GET /invoices
Response: Invoice[]

GET /analytics/dashboard-stats
Response: DashboardStats

POST /subscriptions/checkout
Request: { price_id: string }
Response: { url: string, session_id: string }

GET /subscriptions/check
Response: SubscriptionData
*/
