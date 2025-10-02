// src/services/paymentService.ts
import { apiService } from "./api";

export type PaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "cash"
  | "check"
  | "paypal"
  | "other";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  _id: string;
  userId: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  invoice?: {
    _id: string;
    invoiceNumber: string;
    total: number;
  };
}

export interface CreatePaymentData {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  paymentDate?: string;
}

export interface UpdatePaymentData extends Partial<CreatePaymentData> {
  status?: PaymentStatus;
}

export interface PaymentsListResponse {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  invoiceId?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

class PaymentService {
  async getPayments(filters?: PaymentFilters) {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.invoiceId) params.append("invoiceId", filters.invoiceId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.method) params.append("method", filters.method);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = `/payment${queryString ? `?${queryString}` : ""}`;

    return apiService.get<PaymentsListResponse>(url);
  }

  async getPaymentById(id: string) {
    return apiService.get<Payment>(`/payment/${id}`);
  }

  async createPayment(data: CreatePaymentData) {
    return apiService.post<Payment>("/payment", data);
  }

  async updatePayment(id: string, data: UpdatePaymentData) {
    return apiService.patch<Payment>(`/payment/${id}`, data);
  }

  async deletePayment(id: string) {
    return apiService.delete(`/payment/${id}`);
  }

  async getPaymentsByInvoice(invoiceId: string) {
    return this.getPayments({ invoiceId });
  }
}

export const paymentService = new PaymentService();

// ===================================
// src/services/reminderService.ts
// ===================================

export type ReminderType = "before_due" | "overdue_3" | "overdue_7" | "manual";
export type ReminderStatus = "scheduled" | "sent" | "failed";

export interface Reminder {
  _id: string;
  userId: string;
  invoiceId: string;
  type: ReminderType;
  status: ReminderStatus;
  scheduledFor: string;
  sentAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  invoice?: {
    _id: string;
    invoiceNumber: string;
    dueDate: string;
    total: number;
  };
}

export interface ReminderHistory {
  reminders: Reminder[];
  total: number;
}

export interface ReminderStats {
  totalSent: number;
  totalScheduled: number;
  totalFailed: number;
  byType: {
    before_due: number;
    overdue_3: number;
    overdue_7: number;
    manual: number;
  };
}

class ReminderService {
  async getReminderHistory(invoiceId: string) {
    return apiService.get<ReminderHistory>(`/reminder/invoice/${invoiceId}`);
  }

  async sendManualReminder(invoiceId: string) {
    return apiService.post(`/reminder/send-now/${invoiceId}`);
  }

  async cancelReminders(invoiceId: string) {
    return apiService.delete(`/reminder/cancel/${invoiceId}`);
  }

  async scheduleReminders(invoiceId: string) {
    return apiService.post(`/reminder/schedule/${invoiceId}`);
  }

  async getReminderStats() {
    return apiService.get<ReminderStats>("/reminder/stats");
  }

  async getUpcomingReminders() {
    return apiService.get<{ reminders: Reminder[] }>("/reminder/upcoming");
  }
}

export const reminderService = new ReminderService();
