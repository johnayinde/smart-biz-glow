import { apiService } from './api';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes?: string;
  items: InvoiceItem[];
  client?: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  client_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes?: string;
  items: Omit<InvoiceItem, 'id'>[];
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {}

export interface InvoiceTemplate {
  id: string;
  name: string;
  template_data: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

class InvoiceService {
  async getInvoices(): Promise<{ data: Invoice[] | null; error: string | null }> {
    return apiService.get<Invoice[]>('/invoices');
  }

  async getInvoice(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.get<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: CreateInvoiceData): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.post<Invoice>('/invoices', invoiceData);
  }

  async updateInvoice(id: string, invoiceData: UpdateInvoiceData): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.put<Invoice>(`/invoices/${id}`, invoiceData);
  }

  async deleteInvoice(id: string): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/invoices/${id}`);
  }

  async markAsPaid(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.put<Invoice>(`/invoices/${id}/mark-paid`);
  }

  async downloadInvoice(id: string): Promise<{ data: Blob | null; error: string | null }> {
    // This would return a PDF blob from your backend
    return apiService.get<Blob>(`/invoices/${id}/download`);
  }

  // Invoice Templates
  async getTemplates(): Promise<{ data: InvoiceTemplate[] | null; error: string | null }> {
    return apiService.get<InvoiceTemplate[]>('/invoice-templates');
  }

  async createTemplate(templateData: Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: InvoiceTemplate | null; error: string | null }> {
    return apiService.post<InvoiceTemplate>('/invoice-templates', templateData);
  }

  async updateTemplate(id: string, templateData: Partial<InvoiceTemplate>): Promise<{ data: InvoiceTemplate | null; error: string | null }> {
    return apiService.put<InvoiceTemplate>(`/invoice-templates/${id}`, templateData);
  }

  async deleteTemplate(id: string): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/invoice-templates/${id}`);
  }
}

export const invoiceService = new InvoiceService();