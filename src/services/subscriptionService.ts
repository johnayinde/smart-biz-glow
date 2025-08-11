import { apiService } from './api';

export interface SubscriptionData {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id?: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  created_at: string;
  updated_at: string;
}

export interface CheckoutSession {
  url: string;
  session_id: string;
}

export interface CustomerPortalSession {
  url: string;
}

class SubscriptionService {
  async checkSubscription(): Promise<{ data: SubscriptionData | null; error: string | null }> {
    return apiService.get<SubscriptionData>('/subscriptions/check');
  }

  async createCheckout(priceId: string): Promise<{ data: CheckoutSession | null; error: string | null }> {
    return apiService.post<CheckoutSession>('/subscriptions/checkout', {
      price_id: priceId
    });
  }

  async createCustomerPortal(): Promise<{ data: CustomerPortalSession | null; error: string | null }> {
    return apiService.post<CustomerPortalSession>('/subscriptions/customer-portal');
  }

  async cancelSubscription(): Promise<{ data: SubscriptionData | null; error: string | null }> {
    return apiService.post<SubscriptionData>('/subscriptions/cancel');
  }

  async getSubscriptionHistory(): Promise<{ data: any[] | null; error: string | null }> {
    return apiService.get<any[]>('/subscriptions/history');
  }
}

export const subscriptionService = new SubscriptionService();