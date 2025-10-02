import { apiService } from "./api";

export interface Payment {
  _id: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionReference?: string;
  notes?: string;
  status: "completed" | "pending" | "failed" | "refunded";
  createdAt: string;
}

export interface CreatePaymentData {
  invoiceId: string;
  clientId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionReference?: string;
  notes?: string;
}

class PaymentService {
  async getPayments(): Promise<{
    data: Payment[] | null;
    error: string | null;
  }> {
    return apiService.get<Payment[]>("/payment/payments");
  }

  async createPayment(
    data: CreatePaymentData
  ): Promise<{ data: Payment | null; error: string | null }> {
    return apiService.post<Payment>("/payment/payments", data);
  }

  async getPaymentStats(): Promise<{ data: any; error: string | null }> {
    return apiService.get("/payment/payments/stats");
  }
}

export const paymentService = new PaymentService();
