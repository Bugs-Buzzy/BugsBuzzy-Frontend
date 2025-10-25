// Generic utility for managing payment-related data in browser storage

export interface PaymentContext {
  // Core payment info
  category: string; // e.g., 'competition', 'workshop', 'merchandise', etc.
  items: string[];
  amount: number;
  discount_code?: string;

  // Display metadata
  title: string; // e.g., 'ثبت‌نام رقابت حضوری', 'ثبت‌نام ورکشاپ React'
  description?: string; // Optional extra details

  // Navigation info
  returnUrl: string; // Where to go after viewing success/failure page

  // Additional metadata (flexible for future use)
  metadata?: Record<string, any>;

  // Internal tracking
  timestamp: number;
}

const STORAGE_KEY = 'bugsbuzzy_payment_context';
const EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

export const paymentStorage = {
  /**
   * Store payment context before initiating payment
   * Uses localStorage to persist across redirects from payment gateway
   */
  set(context: Omit<PaymentContext, 'timestamp'>): void {
    const data: PaymentContext = {
      ...context,
      timestamp: Date.now(),
    };
    // Use localStorage instead of sessionStorage to survive gateway redirects
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  /**
   * Retrieve payment context (e.g., after payment callback)
   * Returns null if expired or not found
   */
  get(): PaymentContext | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      const data: PaymentContext = JSON.parse(stored);

      // Check if expired
      if (Date.now() - data.timestamp > EXPIRATION_MS) {
        this.clear();
        return null;
      }

      return data;
    } catch {
      this.clear();
      return null;
    }
  },

  /**
   * Clear payment context from storage
   */
  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Check if a valid payment context exists
   */
  exists(): boolean {
    return this.get() !== null;
  },
};

/**
 * Helper to create standardized item display names
 */
export const getItemDisplayName = (itemName: string): string => {
  const itemNames: Record<string, string> = {
    // Competition items
    inperson: 'ثبت‌نام رقابت حضوری',
    gamejam: 'ثبت‌نام گیم‌جم مجازی',
    thursday_lunch: 'ناهار روز اول (پنجشنبه)',
    friday_lunch: 'ناهار روز دوم (جمعه)',

    // Workshop items (pattern: workshop-{id})
    // These will be handled dynamically if needed
  };

  // Check if it's a workshop item
  if (itemName.startsWith('workshop-')) {
    return `ثبت‌نام کارگاه`;
  }

  return itemNames[itemName] || itemName;
};

/**
 * Helper to format price in Persian
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price / 10) + ' ' + 'تومان';
};
