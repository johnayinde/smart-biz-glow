// src/services/invoiceService.ts
import { apiService } from "./api";

// ===== Types matching backend schema =====
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ReminderConfig {
  enabled: boolean;
  lastReminderSent?: Date;
  remindersSent: number;
  nextReminderDate?: Date;
  sequenceType: "default" | "aggressive" | "gentle";
}

export interface Invoice {
  _id: string;
  userId: string;
  clientId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  reminderConfig: ReminderConfig;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  client?: {
    _id: string;
    name: string;
    email: string;
    company?: string;
  };
}

export interface CreateInvoiceData {
  clientId: string;
  items: InvoiceItem[];
  tax?: number;
  discount?: number;
  currency?: string;
  issueDate: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  reminderConfig?: {
    enabled?: boolean;
    sequenceType?: "default" | "aggressive" | "gentle";
  };
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  status?: InvoiceStatus;
}

export interface InvoicesListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
}

class InvoiceService {
  async getInvoices(filters?: InvoiceFilters) {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.clientId) params.append("clientId", filters.clientId);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = `/invoices${queryString ? `?${queryString}` : ""}`;

    return apiService.get<InvoicesListResponse>(url);
  }

  async getInvoiceById(id: string) {
    return apiService.get<Invoice>(`/invoice/${id}`);
  }

  async createInvoice(data: CreateInvoiceData) {
    return apiService.post<Invoice>("/invoice", data);
  }

  async updateInvoice(id: string, data: UpdateInvoiceData) {
    return apiService.patch<Invoice>(`/invoice/${id}`, data);
  }

  async deleteInvoice(id: string) {
    return apiService.delete(`/invoice/${id}`);
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus) {
    return apiService.patch<Invoice>(`/invoice/${id}`, { status });
  }

  async markAsPaid(id: string) {
    return this.updateInvoiceStatus(id, "paid");
  }

  async sendInvoice(id: string) {
    return this.updateInvoiceStatus(id, "sent");
  }

  async getInvoiceStats() {
    return apiService.get<InvoiceStats>("/invoice/stats");
  }

  async downloadInvoicePDF(id: string) {
    // This returns a blob/pdf file
    const response = await fetch(`${apiService.get}/${id}/download`, {
      headers: {
        Authorization: `Bearer ${apiService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }

    const blob = await response.blob();
    return blob;
  }
}

export const invoiceService = new InvoiceService();
