import { useEffect, useState } from 'react';
import { FaCheckCircle, FaCheck, FaTimesCircle } from 'react-icons/fa';

import Loading from '@/components/Loading';
import PixelFrame from '@/components/PixelFrame';
import { useToast } from '@/context/ToastContext';
import type { ApiError } from '@/services/api';
import { gamejamService } from '@/services/gamejam.service';
import { paymentsService } from '@/services/payments.service';
import { extractFieldErrors } from '@/utils/errorMessages';
import { paymentStorage, formatPrice } from '@/utils/paymentStorage';

interface AdditionalItem {
  id: string;
  label: string;
  required?: boolean;
}

interface PaymentPhaseProps {
  baseItem: string;
  baseItemLabel: string;
  additionalItems?: AdditionalItem[];
  onPaymentComplete: () => void;
  teamId?: number;
  onCancelPayment?: () => void;
}

export default function PaymentPhase({
  baseItem,
  baseItemLabel,
  additionalItems = [],
  onPaymentComplete: _onPaymentComplete,
  teamId,
  onCancelPayment,
}: PaymentPhaseProps) {
  const toast = useToast();
  const [selectedAdditionalItems, setSelectedAdditionalItems] = useState<Set<string>>(new Set());
  const [discountCode, setDiscountCode] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const [itemPrices, setItemPrices] = useState<Record<string, number>>({});
  const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
  const [baseItemAvailable, setBaseItemAvailable] = useState<boolean | null>(null);
  const [purchasedLoaded, setPurchasedLoaded] = useState(false);

  useEffect(() => {
    fetchItemPrices();
    fetchPurchasedItems();
  }, []);

  useEffect(() => {
    if (!purchasedLoaded) {
      return;
    }

    calculatePrice();
  }, [selectedAdditionalItems, purchasedItems, purchasedLoaded]);

  const fetchPurchasedItems = async () => {
    try {
      const result = await paymentsService.getPurchasedItems();
      const purchased = new Set(result.purchased_items);
      setPurchasedItems(purchased);
      setPurchasedLoaded(true);

      // Initialize selectedAdditionalItems with already purchased items
      const purchasedAdditionalItems = additionalItems
        .filter((item) => purchased.has(item.id))
        .map((item) => item.id);

      setSelectedAdditionalItems((prev) => {
        const updated = new Set(prev);
        purchasedAdditionalItems.forEach((itemId) => updated.add(itemId));
        return updated;
      });
    } catch (err) {
      console.error('Failed to fetch purchased items:', err);
      setPurchasedLoaded(true);
    }
  };

  const fetchItemPrices = async () => {
    try {
      const allItems = [baseItem, ...additionalItems.map((i) => i.id)];
      const results = await Promise.allSettled(
        allItems.map((item) => paymentsService.getPrice([item])),
      );

      const pricesMap: Record<string, number> = {};
      let baseOk = false;

      results.forEach((res, idx) => {
        const itemId = allItems[idx];
        if (res.status === 'fulfilled') {
          pricesMap[itemId] = res.value.amount;
          if (itemId === baseItem) baseOk = res.value.amount > 0;
        } else {
          if (itemId === baseItem) baseOk = false;
        }
      });

      setBaseItemAvailable(baseOk);
      if (baseOk) {
        setItemPrices(pricesMap);
      }
    } catch (err) {
      console.error('Failed to fetch item prices:', err);
      setBaseItemAvailable(false);
    }
  };

  const getSelectedItems = (): string[] => {
    const items = [baseItem, ...Array.from(selectedAdditionalItems)];
    return items;
  };

  const getUnpurchasedItems = (): string[] => {
    const selected = getSelectedItems();
    return selected.filter((item) => !purchasedItems.has(item));
  };

  const hasBaseItemPurchased = (): boolean => {
    return purchasedItems.has(baseItem);
  };

  const calculatePrice = async () => {
    if (!purchasedLoaded) {
      return;
    }

    const unpurchasedItems = getUnpurchasedItems();

    // If all items are purchased, no need to calculate
    if (unpurchasedItems.length === 0) {
      setCalculatedPrice(0);
      setOriginalPrice(0);
      setPriceLoading(false);
      setAppliedDiscountCode(null);
      return;
    }

    setPriceLoading(true);
    try {
      const result = await paymentsService.getPrice(unpurchasedItems);
      setCalculatedPrice(result.amount);
      setOriginalPrice(result.amount);
      setDiscountApplied(false);
      setDiscountPercentage(0);
      setAppliedDiscountCode(null);
    } catch (err: any) {
      console.error('Price calculation error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      const errorMsg = message || 'خطا در محاسبه قیمت';
      setError(errorMsg);
      toast.error(errorMsg);
      setCalculatedPrice(null);
      setOriginalPrice(null);
    } finally {
      setPriceLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setFieldErrors({ code: 'لطفاً کد تخفیف را وارد کنید' });
      return;
    }

    // Only apply discount to unpurchased items
    const unpurchasedItems = getUnpurchasedItems();

    if (unpurchasedItems.length === 0) {
      setFieldErrors({ code: 'همه آیتم‌ها قبلاً خریداری شده‌اند' });
      return;
    }

    setPriceLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const result = await paymentsService.applyDiscount(discountCode, unpurchasedItems);

      if (result.discount_applied) {
        if (originalPrice === null && calculatedPrice !== null) {
          setOriginalPrice(calculatedPrice);
        }
      } else {
        setOriginalPrice(result.amount);
      }

      setCalculatedPrice(result.amount);
      setDiscountApplied(result.discount_applied);
      setDiscountPercentage(result.discount_percentage);
      setAppliedDiscountCode(result.discount_applied ? discountCode.trim().toUpperCase() : null);

      if (result.discount_applied) {
        const successMsg = `کد تخفیف با موفقیت اعمال شد! (${result.discount_percentage}% تخفیف)`;
        setSuccessMessage(successMsg);
        toast.success(successMsg);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err: any) {
      const apiError = err as ApiError;

      console.error('Discount validation error:', {
        status: apiError.status,
        error: apiError.error,
        message: apiError.message,
        errors: apiError.errors,
      });

      const errorMessage =
        apiError.errors?.error || apiError.errors?.detail || apiError.error || apiError.message;

      if (errorMessage) {
        const translatedError = extractFieldErrors({ error: errorMessage }).message;
        setFieldErrors({ code: translatedError });
        toast.error(translatedError);
      } else {
        const fallbackError = 'خطا در بررسی کد تخفیف. لطفاً دوباره تلاش کنید';
        setFieldErrors({ code: fallbackError });
        toast.error(fallbackError);
      }

      setDiscountApplied(false);
      setAppliedDiscountCode(null);
    } finally {
      setPriceLoading(false);
    }
  };

  const handlePayment = async () => {
    const unpurchasedItems = getUnpurchasedItems();

    if (unpurchasedItems.length === 0) {
      const errorMsg = 'همه آیتم‌ها قبلاً خریداری شده‌اند';
      setError(errorMsg);
      toast.warning(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const latestPrice = await paymentsService.getPrice(unpurchasedItems);
      const expectedBasePrice = discountApplied ? originalPrice : calculatedPrice;

      if (expectedBasePrice === null) {
        setOriginalPrice(latestPrice.amount);
        setCalculatedPrice(latestPrice.amount);
        setDiscountApplied(false);
        setDiscountPercentage(0);
        setAppliedDiscountCode(null);
        const warningMsg = 'لطفاً دوباره محاسبه و سپس پرداخت را انجام دهید';
        setError(warningMsg);
        toast.warning(warningMsg);
        setLoading(false);
        return;
      }

      // Check if price changed
      if (latestPrice.amount !== expectedBasePrice) {
        setOriginalPrice(latestPrice.amount);
        setCalculatedPrice(latestPrice.amount);
        if (discountApplied) {
          setDiscountApplied(false);
          setDiscountPercentage(0);
          setAppliedDiscountCode(null);
        }
        const warningMsg = discountApplied
          ? 'مبلغ پایه تغییر کرده است. لطفاً کد تخفیف را دوباره اعمال کنید'
          : 'مبلغ به‌روز شد. لطفاً مجدداً تایید و پرداخت کنید';
        setError(warningMsg);
        toast.warning(warningMsg);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error('Price re-validation error:', err);
      const apiError = err as ApiError;
      if (apiError.status === 404 || apiError.status === 410) {
        const errorMsg = 'ثبت‌نام در حال حاضر بسته است';
        setError(errorMsg);
        toast.error(errorMsg);
        setBaseItemAvailable(false);
        setLoading(false);
        return;
      }
      const errorMsg = 'خطا در بررسی قیمت. لطفاً دوباره تلاش کنید';
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }

    if (calculatedPrice === null || calculatedPrice === 0) {
      const errorMsg = 'لطفاً صبر کنید تا قیمت محاسبه شود';
      setError(errorMsg);
      toast.warning(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      // Determine return URL based on competition type
      const returnUrl = unpurchasedItems.includes('inperson')
        ? '/panel/inperson'
        : unpurchasedItems.includes('gamejam')
          ? '/panel/gamejam'
          : '/panel';

      paymentStorage.set({
        category: 'competition',
        title: baseItemLabel,
        description:
          selectedAdditionalItems.size > 0
            ? `شامل ${Array.from(selectedAdditionalItems)
                .filter((id) => !purchasedItems.has(id))
                .map((id) => additionalItems.find((i) => i.id === id)?.label)
                .join(' و ')}`
            : undefined,
        items: unpurchasedItems,
        amount: calculatedPrice,
        discount_code: appliedDiscountCode ?? undefined,
        returnUrl,
      });

      const payment = await paymentsService.createPayment({
        items: unpurchasedItems,
        discount_code: appliedDiscountCode ?? undefined,
      });

      window.location.href = payment.redirect_url;
    } catch (err) {
      console.error('Payment error:', err);
      const apiError = err as ApiError;
      const { message } = extractFieldErrors(apiError.errors);
      const errorMsg = message || 'خطا در ایجاد پرداخت';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAndDelete = async () => {
    if (!teamId || baseItem !== 'gamejam') return;

    if (!confirm('آیا از لغو پرداخت و حذف تیم اطمینان دارید؟!')) {
      return;
    }

    setLoading(true);
    try {
      await gamejamService.deleteTeam(teamId);
      toast.success('تیم حذف شد و به صفحه تیم‌سازی بازگشتید');

      if (onCancelPayment) {
        onCancelPayment();
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || apiError.message || 'خطا در حذف تیم';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdditionalItem = (itemId: string) => {
    const discountWillReset = discountApplied || appliedDiscountCode;

    const newSet = new Set(selectedAdditionalItems);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setSelectedAdditionalItems(newSet);

    if (discountWillReset) {
      setDiscountApplied(false);
      setDiscountPercentage(0);
      setAppliedDiscountCode(null);
      toast.info('کد تخفیف به دلیل تغییر گزینه‌ها حذف شد. در صورت نیاز دوباره اعمال کنید');
    }
  };

  if (loading) {
    return (
      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <div className="py-8">
          <Loading text="در حال بارگذاری وضعیت پرداخت..." />
        </div>
      </PixelFrame>
    );
  }

  // Check if registration is closed
  if (baseItemAvailable === false && purchasedLoaded && !hasBaseItemPurchased()) {
    return (
      <PixelFrame className="bg-primary-midnight bg-opacity-90">
        <h3 className="text-primary-sky font-bold mb-4">🔒 ثبت‌نام بسته است</h3>
        <p className="text-gray-300">متأسفانه ثبت‌نام برای این رقابت در حال حاضر بسته است.</p>
      </PixelFrame>
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <PixelFrame className="bg-green-900 bg-opacity-30 border-green-500">
          <p className="text-green-300">{successMessage}</p>
        </PixelFrame>
      )}

      {error && (
        <PixelFrame className="bg-red-900 bg-opacity-30 border-red-500">
          <p className="text-red-300">{error}</p>
        </PixelFrame>
      )}

      <PixelFrame className="bg-primary-oxfordblue bg-opacity-90">
        <h2 className="text-2xl font-bold text-primary-sky mb-4 flex items-center gap-2">
          <span>💰</span>
          <span>پرداخت هزینه ثبت‌نام</span>
        </h2>
        <p className="text-primary-aero mb-6">برای ادامه، ابتدا هزینه ثبت‌نام را پرداخت کنید.</p>

        {/* Base Item Status */}
        {hasBaseItemPurchased() && (
          <div className="bg-green-900 bg-opacity-20 rounded p-4 mb-4 border border-green-600">
            <div className="flex items-center gap-2 text-green-300">
              <FaCheckCircle className="text-2xl" />
              <div className="flex-1">
                <p className="font-bold">{baseItemLabel} - پرداخت شده</p>
                <p className="text-sm text-green-400">شما قبلاً این آیتم را خریداری کرده‌اید</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Items */}
        {additionalItems.length > 0 && (
          <div className="bg-primary-midnight rounded p-4 mb-4 border border-primary-cerulean space-y-3">
            <h3 className="text-primary-sky font-bold mb-3">گزینه‌های اضافی:</h3>

            {additionalItems.map((item) => {
              const isPurchased = purchasedItems.has(item.id);
              return (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 ${
                    isPurchased ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer group'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAdditionalItems.has(item.id) || isPurchased}
                    onChange={() => !isPurchased && toggleAdditionalItem(item.id)}
                    disabled={item.required || isPurchased}
                    className="w-5 h-5 pixel-checkbox"
                  />
                  <span
                    className={`flex-1 transition-colors ${
                      isPurchased
                        ? 'text-green-400 line-through'
                        : 'text-primary-aero group-hover:text-primary-sky'
                    }`}
                  >
                    {item.label}
                    {isPurchased && (
                      <span className="text-xs mr-2 inline-flex items-center gap-1">
                        <FaCheck />
                        خریداری شده
                      </span>
                    )}
                  </span>
                  {itemPrices[item.id] > 0 && !isPurchased && (
                    <span className="text-primary-aero text-sm font-pixel" dir="ltr">
                      {formatPrice(itemPrices[item.id])}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {/* Discount Code */}
        <div className="bg-primary-midnight rounded p-4 mb-4 border border-primary-cerulean">
          <label className="block text-primary-sky font-bold mb-2">کد تخفیف (اختیاری)</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value.toUpperCase());
                  if (discountApplied) {
                    setDiscountApplied(false);
                    calculatePrice();
                  }
                  if (appliedDiscountCode) {
                    setAppliedDiscountCode(null);
                  }
                  if (fieldErrors.code) {
                    const { code: _code, ...rest } = fieldErrors;
                    setFieldErrors(rest);
                  }
                }}
                placeholder="کد تخفیف را وارد کنید"
                className={`w-full pixel-input bg-primary-oxfordblue text-primary-aero p-3 ${
                  fieldErrors.code ? 'border-red-500' : 'border-primary-cerulean'
                }`}
                maxLength={20}
                disabled={priceLoading}
              />
              {fieldErrors.code && <p className="text-red-400 text-sm mt-1">{fieldErrors.code}</p>}
            </div>
            <button
              onClick={handleApplyDiscount}
              disabled={!discountCode.trim() || priceLoading}
              className="pixel-btn pixel-btn-success px-6 whitespace-nowrap self-start"
            >
              {priceLoading ? '...' : 'اعمال'}
            </button>
          </div>
          {discountApplied && !fieldErrors.code && (
            <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
              <FaCheckCircle />
              <span>کد تخفیف اعمال شد</span>
            </p>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-primary-midnight rounded p-4 mb-6 border border-primary-cerulean">
          <h3 className="text-primary-sky font-bold mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>فاکتور پرداخت</span>
          </h3>
          <div className="space-y-2">
            {/* Base Item */}
            {!hasBaseItemPurchased() ? (
              <div className="flex justify-between text-primary-aero text-sm">
                <span>• {baseItemLabel}</span>
                <span className="font-pixel" dir="ltr">
                  {itemPrices[baseItem] > 0 ? `${formatPrice(itemPrices[baseItem])}` : '...'}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-green-400 text-sm opacity-60">
                <span>• {baseItemLabel}</span>
                <span className="font-pixel flex items-center gap-1" dir="ltr">
                  <FaCheck />
                  <span>پرداخت شده</span>
                </span>
              </div>
            )}

            {/* Additional Items - Selected */}
            {Array.from(selectedAdditionalItems).map((itemId) => {
              const item = additionalItems.find((i) => i.id === itemId);
              const isPurchased = purchasedItems.has(itemId);
              return (
                <div
                  key={itemId}
                  className={`flex justify-between text-sm ${
                    isPurchased ? 'text-green-400 opacity-60' : 'text-primary-aero'
                  }`}
                >
                  <span>• {item?.label}</span>
                  <span className="font-pixel" dir="ltr">
                    {isPurchased ? (
                      <span className="flex items-center gap-1">
                        <FaCheck />
                        <span>پرداخت شده</span>
                      </span>
                    ) : itemPrices[itemId] > 0 ? (
                      `${formatPrice(itemPrices[itemId])}`
                    ) : (
                      '...'
                    )}
                  </span>
                </div>
              );
            })}

            {/* Subtotal */}
            <div className="border-t border-primary-cerulean pt-2 mt-2">
              <div className="flex justify-between text-primary-aero">
                <span>جمع:</span>
                {priceLoading ? (
                  <Loading size="sm" layout="horizontal" text="در حال محاسبه..." />
                ) : originalPrice !== null ? (
                  <span className="font-pixel" dir="ltr">
                    {formatPrice(originalPrice)}
                  </span>
                ) : (
                  <span className="text-red-400">خطا در محاسبه</span>
                )}
              </div>
            </div>

            {/* Discount */}
            {discountApplied && originalPrice && calculatedPrice && (
              <div className="bg-green-900 bg-opacity-20 rounded p-2 border border-green-600">
                <div className="flex justify-between text-green-400 text-sm">
                  <span>🎉 تخفیف ({discountPercentage}%):</span>
                  <span className="font-pixel" dir="ltr">
                    - {formatPrice(originalPrice - calculatedPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Final Total */}
            <div
              className={`border-t-2 pt-3 mt-3 ${
                discountApplied ? 'border-green-500' : 'border-primary-cerulean'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-bold text-lg ${
                    discountApplied ? 'text-green-400' : 'text-primary-sky'
                  }`}
                >
                  {discountApplied ? 'مبلغ نهایی:' : 'مبلغ قابل پرداخت:'}
                </span>
                {priceLoading ? (
                  <span className="text-primary-aero">در حال محاسبه...</span>
                ) : calculatedPrice !== null ? (
                  <span
                    className={`font-pixel font-bold text-xl ${
                      discountApplied ? 'text-green-400' : 'text-primary-sky'
                    }`}
                    dir="ltr"
                  >
                    {formatPrice(calculatedPrice)}
                  </span>
                ) : (
                  <span className="text-red-400">خطا در محاسبه</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {getUnpurchasedItems().length > 0 ? (
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={
                loading || priceLoading || calculatedPrice === null || calculatedPrice === 0
              }
              className="pixel-btn pixel-btn-success w-full py-3 px-8"
            >
              {loading ? 'در حال انتقال...' : 'پرداخت و ادامه'}
            </button>

            {baseItem === 'gamejam' && teamId && onCancelPayment && (
              <button
                onClick={handleCancelAndDelete}
                disabled={loading}
                className="pixel-btn pixel-btn-danger w-full py-3 px-8 flex items-center justify-center gap-2"
              >
                <FaTimesCircle />
                <span>لغو پرداخت و حذف تیم</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-green-900 bg-opacity-30 rounded p-4 border border-green-600">
              <p className="text-green-300 text-center flex items-center justify-center gap-2">
                <FaCheckCircle className="text-lg" />
                <span>همه موارد قبلاً پرداخت شده است.</span>
              </p>
            </div>
            <button
              onClick={_onPaymentComplete}
              className="pixel-btn pixel-btn-primary w-full py-3 text-lg font-bold"
            >
              ادامه به تیم‌سازی ←
            </button>
          </div>
        )}
      </PixelFrame>
    </div>
  );
}
