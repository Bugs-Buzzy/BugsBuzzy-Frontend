# ساختار CSS پروژه BugsBuzzy

## فهرست فایل‌ها

### 1. `src/styles/global.css`

**هدف**: تنظیمات پایه، فونت‌ها، متغیرها و استایل‌های سراسری

**محتویات**:

- Tailwind directives (`@tailwind base/components/utilities`)
- تعریف فونت‌های فارسی: IRANSansX, PeydaWeb, Estedad
- تعریف فونت‌های پیکسلی: Unixel (فارسی), Pixelify Sans (انگلیسی)
- CSS Variables در `:root`:
  - `--pixel-border-width`: عرض بوردر پیکسلی (4px)
  - `--pixel-shadow-size`: سایز سایه (8px)
  - `--color-primary`: رنگ اصلی (#2EB1E0 - Process Blue)
  - `--color-secondary`: رنگ ثانویه (#FAA61A - Ramzinex Orange)
- استایل‌های اسکرول‌بار سفارشی
- گرادیانت پس‌زمینه بادی
- ریست‌های پایه

### 2. `src/styles/components.css`

**هدف**: کلاس‌های قابل استفاده مجدد برای کامپوننت‌های پیکسلی

**کامپوننت‌های تعریف شده**:

#### فونت‌ها

- `.pixel-text-fa`: فونت پیکسلی فارسی (Unixel)
- `.pixel-text-en`: فونت پیکسلی انگلیسی (Pixelify Sans)

#### دکمه‌ها

- `.pixel-btn`: استایل پایه دکمه پیکسلی
- `.pixel-btn-primary`: دکمه آبی (Process)
- `.pixel-btn-secondary`: دکمه نارنجی (Ramzinex)
- `.pixel-btn-success`: دکمه سبز
- `.pixel-btn-danger`: دکمه قرمز
- `.pixel-btn-dark`: دکمه تیره

#### کارت‌ها

- `.pixel-card`: استایل پایه کارت پیکسلی
- `.pixel-card-primary`: بوردر آبی
- `.pixel-card-secondary`: بوردر نارنجی
- `.pixel-card-white`: بوردر سفید

#### Input ها

- `.pixel-input`: استایل input پیکسلی

#### HUD

- `.hud-panel`: پنل‌های رابط کاربری
- `.hud-nav-item`: آیتم‌های منوی ناوبری
- `.hud-nav-item.active`: حالت فعال

#### Floor (طبقات)

- `.floor`: سکشن‌های تمام‌صفحه برای scroll-snap

#### مودال‌ها

- `.pixel-modal-overlay`: پس‌زمینهٔ مودال
- `.pixel-modal-content`: محتوای مودال
- `.pixel-modal-close`: دکمهٔ بستن

### 3. `src/styles/gameworld.css`

**هدف**: استایل‌های مختص کانتینر اصلی دنیای بازی

**محتویات**:

- `.game-world-container`: کانتینر scroll-snap عمودی

### 4. `src/styles/pixel.css`

**وضعیت**: DEPRECATED - برای سازگاری با گذشته نگهداری شده

این فایل فقط `components.css` را ایمپورت می‌کند.

## رنگ‌های پالت (از tailwind.config.js)

### Primary (آبی - تم Process)

- `primary-columbia`: #CEEDF7 (خیلی روشن)
- `primary-nonphoto`: #A6DEF2
- `primary-sky`: #7DCEEC
- `primary-aero`: #56C0E6
- `primary-process`: #2EB1E0 ⭐ (اصلی)
- `primary-cerulean`: #17789B
- `primary-midnight`: #0B3A4B
- `primary-oxfordblue`: #0B1F47

### Secondary (نارنجی - تم Ramzinex)

- `secondary-golden`: #F14F04 (تیره)
- `secondary-orangePantone`: #FB5D13
- `secondary-orangeCrayola`: #FC7738
- `secondary-ramzinex`: #FAA61A ⭐ (اصلی)

## فونت‌های پروژه

### ⚡ سیستم فونت ساده شده

فقط **دو کلاس فونت** در پروژه وجود دارد:

#### 1. `font-pixel` (فونت پیکسلی - برای عناوین و UI)

- **انگلیسی**: Pixelify Sans (اولویت اول)
- **فارسی**: Unixel (fallback خودکار)

#### 2. `font-normal` (فونت عادی - برای متن‌ها)

- **انگلیسی**: Comic Sans MS (اولویت اول)
- **فارسی**: IRANSansX (fallback خودکار)

## چگونه استفاده کنیم؟

### مثال 1: دکمه پیکسلی

```jsx
<button className="pixel-btn pixel-btn-primary">کلیک کنید</button>
```

### مثال 2: کارت با بوردر رنگی

```jsx
<div className="pixel-card pixel-card-secondary bg-gray-900 p-6">محتوای کارت</div>
```

### مثال 3: متن پیکسلی (فارسی/انگلیسی)

```jsx
<h1 className="font-pixel text-3xl">BugsBuzzy</h1>
<h1 className="font-pixel text-3xl">عنوان فارسی</h1>
```

### مثال 4: متن عادی (فارسی/انگلیسی)

```jsx
<p className="font-normal">This is English text</p>
<p className="font-normal">این یک متن فارسی است</p>
```

### مثال 5: Input پیکسلی

```jsx
<input type="text" className="pixel-input bg-gray-800 text-white border-gray-600 p-3" />
```

### مثال 6: استفاده از رنگ‌های پالت

```jsx
<div className="bg-primary-process text-white">
  پس‌زمینهٔ آبی اصلی
</div>

<div className="bg-secondary-ramzinex text-black">
  پس‌زمینهٔ نارنجی اصلی
</div>
```

### مثال 7: بوردر پیکسلی BugsBuzzy (Pixel Frame)

```jsx
import PixelFrame from '@/components/PixelFrame';

<PixelFrame className="max-w-4xl mx-auto">
  <h2 className="font-pixel text-3xl mb-4">عنوان</h2>
  <p className="font-normal">محتوای داخل فریم پیکسلی</p>
</PixelFrame>

// یا با کلاس CSS
<div className="pixel-frame">
  محتوا
</div>
```

## قوانین کدنویسی

1. ✅ **همیشه از کلاس‌های تعریف شده در `components.css` استفاده کنید**
2. ✅ **از رنگ‌های tailwind config استفاده کنید** (`primary-*`, `secondary-*`)
3. ✅ **فقط دو کلاس فونت وجود دارد**: `font-pixel` و `font-normal`
4. ✅ **`font-pixel`**: برای عناوین، دکمه‌ها، UI (خودکار فارسی/انگلیسی)
5. ✅ **`font-normal`**: برای توضیحات، متن‌ها (خودکار فارسی/انگلیسی)
6. ❌ **استایل‌های inline را محدود کنید**
7. ❌ **رنگ‌های هاردکد (مثل `#fff`) به‌جای متغیرها استفاده نکنید**

## نکات مهم

- تمام متغیرهای CSS در `global.css` تعریف شده‌اند
- برای افزودن کامپوننت جدید، آن را در `components.css` تعریف کنید
- از نام‌گذاری BEM یا semantic استفاده کنید
- هر کامپوننت CSS باید توضیحات واضح داشته باشد

### RTL و ترکیب فارسی/انگلیسی

- ✅ `direction: rtl` برای html فعال است
- ✅ `unicode-bidi: plaintext` برای همه المنت‌های متنی فعال است
- ✅ متن‌های ترکیبی (فارسی + انگلیسی) به صورت خودکار صحیح نمایش داده می‌شوند

### بوردر پیکسلی BugsBuzzy

- استفاده از کامپوننت `<PixelFrame>` یا کلاس `.pixel-frame`
- شامل 5 لایه بوردر با رنگ‌های قهوه‌ای، نارنجی و زرد
- دکوراسیون‌های گوشه به صورت خودکار اضافه می‌شوند
