import { apiClient } from './api';

export interface PriceResponse {
  amount: number;
}

export interface DiscountRequest {
  code: string;
  items: string[];
}

export interface DiscountResponse {
  amount: number;
  discount_applied: boolean;
  discount_percentage: number;
}

export interface PaymentRequest {
  discount_code?: string;
  items: string[];
}

export interface PaymentResponse {
  redirect_url: string;
}

export interface PurchasedItemsResponse {
  purchased_items: string[];
  total_transactions: number;
  total_spent: number;
}

class PaymentsService {
  /**
   * Get list of items user has already purchased
   */
  async getPurchasedItems(): Promise<PurchasedItemsResponse> {
    return apiClient.get<PurchasedItemsResponse>('/payment/purchased/');
  }

  /**
   * Get price for items without discount code
   * No rate limiting - can be called frequently
   */
  async getPrice(items: string[]): Promise<PriceResponse> {
    const params = new URLSearchParams();
    items.forEach((item) => params.append('items', item));
    return apiClient.get<PriceResponse>(`/payment/price/?${params.toString()}`);
  }

  /**
   * Validate discount code and get discounted price
   * RATE LIMITED - max 10 requests per minute
   */
  async applyDiscount(code: string, items: string[]): Promise<DiscountResponse> {
    const params = new URLSearchParams();
    params.append('code', code);
    items.forEach((item) => params.append('items', item));
    return apiClient.get<DiscountResponse>(`/payment/discount/?${params.toString()}`);
  }

  async createPayment(data: PaymentRequest): Promise<PaymentResponse> {
    return apiClient.post<PaymentResponse>('/payment/pay/', data);
  }
}

export const paymentsService = new PaymentsService();
