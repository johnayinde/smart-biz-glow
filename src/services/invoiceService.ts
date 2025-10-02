import { apiService } from "./api";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  issueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: string;
  notes?: string;
  reminderConfig: {
    enabled: boolean;
    lastReminderSent?: string;
    remindersSent: number;
    nextReminderDate?: string;
    sequenceType: "default" | "aggressive" | "gentle";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  clientId: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate?: number;
  discount?: number;
  currency?: string;
  notes?: string;
  status?: string;
}

class InvoiceService {
  async getInvoices(): Promise<{
    data: Invoice[] | null;
    error: string | null;
  }> {
    return apiService.get<Invoice[]>("/invoice/invoices");
  }

  async getInvoice(
    id: string
  ): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.get<Invoice>(`/invoice/invoices/${id}`);
  }

  async createInvoice(
    data: CreateInvoiceData
  ): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.post<Invoice>("/invoice/invoices", data);
  }

  async updateInvoice(
    id: string,
    data: Partial<CreateInvoiceData>
  ): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.patch<Invoice>(`/invoice/invoices/${id}`, data);
  }

  async deleteInvoice(
    id: string
  ): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/invoice/invoices/${id}`);
  }

  async markAsPaid(
    id: string
  ): Promise<{ data: Invoice | null; error: string | null }> {
    return apiService.post<Invoice>(`/invoice/invoices/${id}/mark-paid`, {
      paidAt: new Date().toISOString(),
      paymentMethod: "manual",
    });
  }
}

export const invoiceService = new InvoiceService();
