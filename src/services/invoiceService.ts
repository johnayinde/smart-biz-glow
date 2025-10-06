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

export type InvoiceSortBy =
  | "invoiceNumber"
  | "issueDate"
  | "dueDate"
  | "total"
  | "createdAt"
  | "status";
export interface ReminderConfig {
  enabled: boolean;
  lastReminderSent?: Date;
  remindersSent: number;
  nextReminderDate?: Date;
  sequenceType: "default" | "aggressive" | "gentle";
}

export interface Invoice {
  _id: string;
  id: string;
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
  sortBy?: InvoiceSortBy;
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

    if (filters?.sortBy) {
      params.append("sortBy", filters.sortBy);
    }

    if (filters?.sortOrder && filters?.sortBy) {
      params.append("sortOrder", filters.sortOrder);
    }
    const queryString = params.toString();
    const url = `/invoices${queryString ? `?${queryString}` : ""}`;

    // ✅ Returns { success, data: Invoice[], meta }
    return apiService.get<Invoice[]>(url);
  }

  async getInvoiceById(id: string) {
    return apiService.get<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(data: CreateInvoiceData) {
    return apiService.post<Invoice>("/invoices", data);
  }

  async updateInvoice(id: string, data: UpdateInvoiceData) {
    return apiService.patch<Invoice>(`/invoices/${id}`, data);
  }

  async deleteInvoice(id: string) {
    return apiService.delete(`/invoices/${id}`);
  }

  async markAsPaid(id: string) {
    return apiService.post<Invoice>(`/invoices/${id}/mark-paid`, {});
  }

  async sendInvoice(id: string) {
    return apiService.post<Invoice>(`/invoices/${id}/send`, {});
  }
}

export const invoiceService = new InvoiceService();
