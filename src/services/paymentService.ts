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
  method?: PaymentMethod;
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
  async getPayments(filters?: PaymentFilters): Promise<PaymentsListResponse> {
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
    const url = `/payments${queryString ? `?${queryString}` : ""}`;

    const response = await apiService.get<any>(url);

    // Handle different response formats
    if (response.data?.payments) {
      return {
        payments: response.data.payments,
        total: response.data.meta?.total || response.data.total || 0,
        page: response.data.meta?.page || response.data.page || 1,
        limit: response.data.meta?.limit || response.data.limit || 10,
        totalPages:
          response.data.meta?.totalPages || response.data.totalPages || 1,
        meta: response.data.meta,
      };
    }

    // Fallback for direct data array
    return {
      payments: response.data || [],
      total: response.data?.length || 0,
      page: 1,
      limit: filters?.limit || 10,
      totalPages: 1,
    };
  }

  async getPaymentById(id: string): Promise<{ data: Payment }> {
    return apiService.get<Payment>(`/payment/${id}`);
  }

  async createPayment(data: CreatePaymentData): Promise<{ data: Payment }> {
    const payload = {
      ...data,
      currency: data.currency || "USD",
      paymentDate: data.paymentDate || new Date().toISOString(),
    };
    return apiService.post<Payment>("/payment", payload);
  }

  async updatePayment(
    id: string,
    data: UpdatePaymentData
  ): Promise<{ data: Payment }> {
    return apiService.patch<Payment>(`/payment/${id}`, data);
  }

  async deletePayment(id: string): Promise<{ message: string }> {
    return apiService.delete(`/payment/${id}`);
  }

  async getPaymentsByInvoice(invoiceId: string): Promise<PaymentsListResponse> {
    return this.getPayments({ invoiceId, limit: 100 });
  }

  async getPaymentStats(): Promise<{ data: PaymentStats }> {
    try {
      // Try to get stats from dedicated endpoint
      return apiService.get<PaymentStats>("/payment/stats");
    } catch (error) {
      // Fallback: calculate stats from payments list
      const response = await this.getPayments({ limit: 1000 });
      const payments = response.payments || [];

      const stats: PaymentStats = {
        totalRevenue: 0,
        completed: { count: 0, amount: 0 },
        pending: { count: 0, amount: 0 },
        failed: { count: 0, amount: 0 },
        refunded: { count: 0, amount: 0 },
        byMethod: {},
      };

      payments.forEach((payment) => {
        stats.totalRevenue += payment.amount;

        // Status aggregation
        if (payment.status === "completed") {
          stats.completed.count += 1;
          stats.completed.amount += payment.amount;
        } else if (payment.status === "pending") {
          stats.pending.count += 1;
          stats.pending.amount += payment.amount;
        } else if (payment.status === "failed") {
          stats.failed.count += 1;
          stats.failed.amount += payment.amount;
        } else if (payment.status === "refunded") {
          stats.refunded.count += 1;
          stats.refunded.amount += payment.amount;
        }

        // Method aggregation
        if (!stats.byMethod[payment.method]) {
          stats.byMethod[payment.method] = { count: 0, amount: 0 };
        }
        stats.byMethod[payment.method].count += 1;
        stats.byMethod[payment.method].amount += payment.amount;
      });

      return { data: stats };
    }
  }
}

export const paymentService = new PaymentService();
