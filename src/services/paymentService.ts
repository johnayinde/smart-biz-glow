import { apiService } from './api';

export interface Payment {
  id: string;
  invoice_id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}

export interface CreatePaymentData {
  invoice_id?: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

export interface PaymentStats {
  total_received: number;
  total_pending: number;
  total_overdue: number;
  recent_payments: Payment[];
}

class PaymentService {
  async getPayments(): Promise<{ data: Payment[] | null; error: string | null }> {
    return apiService.get<Payment[]>('/payments');
  }

  async getPayment(id: string): Promise<{ data: Payment | null; error: string | null }> {
    return apiService.get<Payment>(`/payments/${id}`);
  }

  async createPayment(paymentData: CreatePaymentData): Promise<{ data: Payment | null; error: string | null }> {
    return apiService.post<Payment>('/payments', paymentData);
  }

  async updatePayment(id: string, paymentData: Partial<CreatePaymentData>): Promise<{ data: Payment | null; error: string | null }> {
    return apiService.put<Payment>(`/payments/${id}`, paymentData);
  }

  async deletePayment(id: string): Promise<{ data: any; error: string | null }> {
    return apiService.delete(`/payments/${id}`);
  }

  async getPaymentStats(): Promise<{ data: PaymentStats | null; error: string | null }> {
    return apiService.get<PaymentStats>('/payments/stats');
  }
}

export const paymentService = new PaymentService();