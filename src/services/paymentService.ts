// src/services/paymentService.ts
import { apiService } from "./api";
import { BulkDeleteResponse, BulkUpdateResponse } from "./invoiceService";

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
  id: string;
  userId: string;
  invoiceId: any;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  transactionId?: string;
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
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  paymentDate?: string;
  currency?: string;
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
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  invoiceId?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod; // ✅ FIXED  startDate?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentStats {
  totalRevenue: number;
  completed: { count: number; amount: number };
  pending: { count: number; amount: number };
  failed: { count: number; amount: number };
  refunded: { count: number; amount: number };
  byMethod: {
    [key: string]: { count: number; amount: number };
  };
}

class PaymentService {
  async getPayments(filters?: PaymentFilters) {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.invoiceId) params.append("invoiceId", filters.invoiceId);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.paymentMethod)
      params.append("paymentMethod", filters.paymentMethod);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = `/payments${queryString ? `?${queryString}` : ""}`;

    // ✅ Returns { success, data: Payment[], meta }
    return apiService.get<Payment[]>(url);
  }

  async getPaymentById(id: string) {
    return apiService.get<Payment>(`/payments/${id}`);
  }

  async createPayment(data: CreatePaymentData) {
    return apiService.post<Payment>("/payments", data);
  }

  async updatePayment(id: string, data: UpdatePaymentData) {
    return apiService.patch<Payment>(`/payments/${id}`, data);
  }

  async deletePayment(id: string) {
    return apiService.delete(`/payments/${id}`);
  }

  async getStats() {
    return apiService.get<any>("/payments/stats");
  }

  async refundPayment(id: string, amount: number, reason?: string) {
    return apiService.post(`/payments/${id}/refund`, { amount, reason });
  }

  async getPaymentsByInvoice(invoiceId: string) {
    return this.getPayments({ invoiceId, limit: 100 });
  }

  async bulkDelete(ids: string[]): Promise<BulkDeleteResponse> {
    const response = await apiService.post<BulkDeleteResponse>(
      "/payments/bulk/delete",
      { ids }
    );
    return response.data;
  }

  async bulkUpdateStatus(
    ids: string[],
    status: PaymentStatus
  ): Promise<BulkUpdateResponse> {
    const response = await apiService.post<BulkUpdateResponse>(
      "/payments/bulk/update-status",
      { ids, status }
    );
    return response.data;
  }

  // async getPaymentStats(): Promise<{ data: PaymentStats }> {
  //   try {
  //     // Try to get stats from dedicated endpoint
  //     return apiService.get<PaymentStats>("/payment/stats");
  //   } catch (error) {
  //     // Fallback: calculate stats from payments list
  //     const response = await this.getPayments({ limit: 1000 });
  //     const payments = response.payments || [];

  //     const stats: PaymentStats = {
  //       totalRevenue: 0,
  //       completed: { count: 0, amount: 0 },
  //       pending: { count: 0, amount: 0 },
  //       failed: { count: 0, amount: 0 },
  //       refunded: { count: 0, amount: 0 },
  //       byMethod: {},
  //     };

  //     payments.forEach((payment) => {
  //       stats.totalRevenue += payment.amount;

  //       // Status aggregation
  //       if (payment.status === "completed") {
  //         stats.completed.count += 1;
  //         stats.completed.amount += payment.amount;
  //       } else if (payment.status === "pending") {
  //         stats.pending.count += 1;
  //         stats.pending.amount += payment.amount;
  //       } else if (payment.status === "failed") {
  //         stats.failed.count += 1;
  //         stats.failed.amount += payment.amount;
  //       } else if (payment.status === "refunded") {
  //         stats.refunded.count += 1;
  //         stats.refunded.amount += payment.amount;
  //       }

  //       // Method aggregation
  //       if (!stats.byMethod[payment.method]) {
  //         stats.byMethod[payment.method] = { count: 0, amount: 0 };
  //       }
  //       stats.byMethod[payment.method].count += 1;
  //       stats.byMethod[payment.method].amount += payment.amount;
  //     });

  //     return { data: stats };
  //   }
  // }
}

export const paymentService = new PaymentService();
