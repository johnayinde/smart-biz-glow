
// Mock data for the Smart Invoice system

// User data
export const currentUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder.svg',
  company: 'Acme Inc.',
  position: 'Owner',
  createdAt: '2023-01-01'
};

// Invoice status types
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';

// Invoice interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
}

// Invoice item interface
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Client interface
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  createdAt: string;
  totalBilled: number;
  status: 'active' | 'inactive';
}

// Dashboard stats interface
export interface DashboardStats {
  totalInvoiced: number;
  pendingAmount: number;
  overdue: number;
  paid: number;
  clientsCount: number;
  recentActivity: ActivityItem[];
}

// Activity item interface
export interface ActivityItem {
  id: string;
  description: string;
  type: 'invoice' | 'payment' | 'client';
  date: string;
  amount?: number;
}

// AI insights interface
export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  category: 'cashflow' | 'clients' | 'growth' | 'operational';
  metrics?: {
    label: string;
    value: string;
  }[];
}

// Mock clients
export const clients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '(555) 123-4567',
    address: '123 Business St, Tech City, 90210',
    company: 'Acme Corp',
    createdAt: '2023-01-15',
    totalBilled: 12500,
    status: 'active'
  },
  {
    id: '2',
    name: 'Globex Industries',
    email: 'accounts@globex.com',
    phone: '(555) 987-6543',
    address: '456 Corporate Ave, Business Park, 60601',
    company: 'Globex Inc',
    createdAt: '2023-02-20',
    totalBilled: 8750,
    status: 'active'
  },
  {
    id: '3',
    name: 'Stark Innovations',
    email: 'payments@stark.com',
    phone: '(555) 111-2222',
    address: '789 Innovation Blvd, Tech Valley, 10001',
    company: 'Stark Industries',
    createdAt: '2023-03-10',
    totalBilled: 21000,
    status: 'active'
  },
  {
    id: '4',
    name: 'Wayne Enterprises',
    email: 'finance@wayne.com',
    phone: '(555) 333-4444',
    address: '1007 Gotham Road, Gotham City, 80808',
    company: 'Wayne Corp',
    createdAt: '2023-04-05',
    totalBilled: 15250,
    status: 'inactive'
  },
  {
    id: '5',
    name: 'Initech LLC',
    email: 'billing@initech.com',
    phone: '(555) 555-5555',
    address: '101 Office Space Ln, Corporate Park, 30301',
    company: 'Initech',
    createdAt: '2023-05-12',
    totalBilled: 6500,
    status: 'active'
  }
];

// Mock invoices
export const invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientId: '1',
    clientName: 'Acme Corporation',
    amount: 2500,
    tax: 250,
    total: 2750,
    currency: 'USD',
    status: 'paid',
    issueDate: '2023-03-01',
    dueDate: '2023-03-15',
    items: [
      {
        id: '1-1',
        description: 'Web Design Services',
        quantity: 1,
        rate: 1500,
        amount: 1500
      },
      {
        id: '1-2',
        description: 'Hosting Setup',
        quantity: 1,
        rate: 1000,
        amount: 1000
      }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientId: '2',
    clientName: 'Globex Industries',
    amount: 1800,
    tax: 180,
    total: 1980,
    currency: 'USD',
    status: 'pending',
    issueDate: '2023-03-10',
    dueDate: '2023-03-25',
    items: [
      {
        id: '2-1',
        description: 'Monthly Maintenance',
        quantity: 1,
        rate: 800,
        amount: 800
      },
      {
        id: '2-2',
        description: 'Feature Development',
        quantity: 10,
        rate: 100,
        amount: 1000
      }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    clientId: '3',
    clientName: 'Stark Innovations',
    amount: 5000,
    tax: 500,
    total: 5500,
    currency: 'USD',
    status: 'overdue',
    issueDate: '2023-02-15',
    dueDate: '2023-03-01',
    items: [
      {
        id: '3-1',
        description: 'Custom Software Development',
        quantity: 1,
        rate: 5000,
        amount: 5000
      }
    ],
    notes: 'Payment due immediately'
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    clientId: '1',
    clientName: 'Acme Corporation',
    amount: 1200,
    tax: 120,
    total: 1320,
    currency: 'USD',
    status: 'paid',
    issueDate: '2023-02-01',
    dueDate: '2023-02-15',
    items: [
      {
        id: '4-1',
        description: 'SEO Services',
        quantity: 1,
        rate: 1200,
        amount: 1200
      }
    ]
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    clientId: '4',
    clientName: 'Wayne Enterprises',
    amount: 3500,
    tax: 350,
    total: 3850,
    currency: 'USD',
    status: 'draft',
    issueDate: '2023-03-20',
    dueDate: '2023-04-05',
    items: [
      {
        id: '5-1',
        description: 'Security Consulting',
        quantity: 5,
        rate: 700,
        amount: 3500
      }
    ]
  }
];

// Mock dashboard stats
export const dashboardStats: DashboardStats = {
  totalInvoiced: 14400,
  pendingAmount: 1980,
  overdue: 5500,
  paid: 6920,
  clientsCount: 5,
  recentActivity: [
    {
      id: '1',
      description: 'Invoice INV-002 sent to Globex Industries',
      type: 'invoice',
      date: '2023-03-10',
      amount: 1980
    },
    {
      id: '2',
      description: 'Payment received from Acme Corporation',
      type: 'payment',
      date: '2023-03-05',
      amount: 2750
    },
    {
      id: '3',
      description: 'New client added: Initech LLC',
      type: 'client',
      date: '2023-03-01'
    },
    {
      id: '4',
      description: 'Invoice INV-003 is now overdue',
      type: 'invoice',
      date: '2023-03-01',
      amount: 5500
    }
  ]
};

// Mock insights
export const insights: Insight[] = [
  {
    id: '1',
    title: 'Cash Flow Warning',
    description: 'Your pending and overdue invoices total $7,480, which is 52% of your total invoiced amount. Consider following up on these payments to improve cash flow.',
    type: 'warning',
    date: '2023-03-15',
    category: 'cashflow',
    metrics: [
      { label: 'Pending Amount', value: '$1,980' },
      { label: 'Overdue Amount', value: '$5,500' },
      { label: 'Percentage of Total', value: '52%' }
    ]
  },
  {
    id: '2',
    title: 'Client Opportunity',
    description: 'Acme Corporation has been your most consistent client with regular payments. Consider offering them a discount on annual services to secure longer-term contracts.',
    type: 'info',
    date: '2023-03-14',
    category: 'clients',
    metrics: [
      { label: 'Total Billed', value: '$4,070' },
      { label: 'Payment Rate', value: '100%' },
      { label: 'Average Time to Pay', value: '12 days' }
    ]
  },
  {
    id: '3',
    title: 'Growth Potential',
    description: 'Based on your current invoicing rate, you could increase monthly revenue by 25% by converting your draft invoices to sent status and following up on overdue payments.',
    type: 'success',
    date: '2023-03-10',
    category: 'growth',
    metrics: [
      { label: 'Potential Additional Monthly Revenue', value: '$3,600' },
      { label: 'Growth Percentage', value: '25%' }
    ]
  },
  {
    id: '4',
    title: 'Operational Efficiency',
    description: 'You currently have 5 active clients with an average invoice value of $2,880. Focusing on increasing your average invoice value could be more efficient than acquiring new clients.',
    type: 'info',
    date: '2023-03-08',
    category: 'operational',
    metrics: [
      { label: 'Average Invoice Value', value: '$2,880' },
      { label: 'Industry Average', value: '$3,200' },
      { label: 'Potential Improvement', value: '11%' }
    ]
  }
];

// Helper function to get mock data
export const getMockData = {
  invoices: () => invoices,
  clients: () => clients,
  dashboard: () => dashboardStats,
  insights: () => insights,
  currentUser: () => currentUser,

  // Helper functions for filtered data
  invoicesByStatus: (status: InvoiceStatus) => {
    return invoices.filter(invoice => invoice.status === status);
  },
  
  invoicesByClient: (clientId: string) => {
    return invoices.filter(invoice => invoice.clientId === clientId);
  },
  
  getClient: (clientId: string) => {
    return clients.find(client => client.id === clientId);
  },
  
  getInvoice: (invoiceId: string) => {
    return invoices.find(invoice => invoice.id === invoiceId);
  }
};
