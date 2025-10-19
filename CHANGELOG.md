# تغییرات پروژه BugsBuzzy Frontend

## نسخه فعلی - بازطراحی کامل

### ✨ ویژگی‌های جدید

#### 1. معماری "لانهٔ خرگوش" (Rabbit Hole)

- **Scroll Snap عمودی**: اسکرول کنترل‌شده یک‌به‌یک بین طبقات
- **5 طبقه**: لندینگ، رقابت‌ها، کارگاه‌ها، حامیان، تیم
- **HUD ثابت**: منوی سفر سریع و دکمه‌های ورود/پنل
- **مدیریت اسکرول هوشمند**: جلوگیری از اسکرول سریع و چند طبقه

#### 2. سیستم احراز هویت Passwordless

- **فلوی دو مرحله‌ای**: ایمیل → کد 6 رقمی
- **Context API**: مدیریت استیت کاربر
- **Protected Routes**: محافظت از صفحه پنل
- **سیستم Validation**: محدودسازی دسترسی تا تکمیل پروفایل

#### 3. صفحه پنل کاربری

- **Sidebar**: منوی کناری با لینک‌های مختلف
- **Nested Routes**: پروفایل، کارگاه‌ها، تیم
- **قفل منطقی**: غیرفعال‌سازی بخش‌ها تا تایید پروفایل

### 🎨 سیستم طراحی

#### فونت‌های پروژه

```
font-pixel:  Pixelify Sans (EN) → Unixel (FA)
font-normal: Comic Sans MS (EN) → IRANSansX (FA)
```

**ویژگی‌ها:**

- ✅ تشخیص خودکار زبان با `unicode-range`
- ✅ فونت Pixelify Sans از Google Fonts
- ✅ فونت Unixel لوکال (فارسی پیکسلی)
- ✅ پشتیبانی کامل از ترکیب فارسی/انگلیسی

#### رنگ‌های پالت

**Primary (آبی - Process):**

- `#2EB1E0` - رنگ اصلی
- `#56C0E6` - روشن‌تر
- `#17789B` - تیره‌تر

**Secondary (نارنجی - Ramzinex):**

- `#FAA61A` - رنگ اصلی
- `#FC7738` - روشن‌تر
- `#F14F04` - تیره‌تر

#### بوردر پیکسلی BugsBuzzy

**کامپوننت جدید:** `<PixelFrame>` یا کلاس `.pixel-frame`

**ویژگی‌ها:**

- 5 لایه بوردر (قهوه‌ای → نارنجی → زرد)
- دکوراسیون‌های گوشه خودکار
- padding داخلی 32px
- انیمیشن hover برای کارت‌ها

**رنگ‌های بوردر:**

```css
#5a3d0f → #7d5006 → #a86b0c → #faa61a → #f8b84d
```

### 🔧 بهبودهای فنی

#### RTL و چندزبانه بودن

- ✅ `direction: rtl` برای html
- ✅ `unicode-bidi: plaintext` برای همه المنت‌های متنی
- ✅ نمایش صحیح ترکیب فارسی/انگلیسی در یک خط

#### ساختار CSS

**4 فایل اصلی:**

1. `global.css` - فونت‌ها، متغیرها، ریست‌ها
2. `components.css` - کامپوننت‌های قابل استفاده مجدد
3. `gameworld.css` - scroll container
4. `pixel.css` - deprecated (برای سازگاری)

**کامپوننت‌های CSS:**

- `.pixel-btn` + variants (primary, secondary, success, danger, dark)
- `.pixel-frame` - بوردر پیکسلی BugsBuzzy
- `.pixel-input` - input با استایل پیکسلی
- `.hud-nav-item` - آیتم‌های منوی HUD
- `.floor` - سکشن‌های scroll-snap

### 📦 کامپوننت‌های React

#### Floors (طبقات)

- `LandingFloor` - صفحه اصلی با دکمه ثبت‌نام
- `CompetitionsFloor` - نمایش رقابت‌ها با مودال
- `WorkshopsFloor` - کارگاه‌ها با سیستم ثبت‌نام
- `SponsorsFloor` - نمایش لوگوی حامیان
- `TeamFloor` - معرفی اعضای تیم

#### UI Components

- `HUD` - رابط کاربری ثابت (Fast Travel + Login)
- `PixelFrame` - wrapper برای بوردر پیکسلی
- `PixelModal` - مودال با استایل پیکسلی
- `LoginModal` - فلوی ورود دو مرحله‌ای
- `ProtectedRoute` - محافظت از روت‌ها

#### Pages

- `GameWorld` - کانتینر اصلی با scroll-snap
- `Panel` - Layout پنل با Sidebar
- `ProfileSettings` - ویرایش پروفایل
- `MyWorkshops` - لیست کارگاه‌های ثبت‌نام شده
- `MyTeam` - مدیریت تیم

### 🚀 نحوه استفاده

#### نصب وابستگی‌ها

```bash
npm install
```

#### اجرا در حالت توسعه

```bash
npm run dev
```

#### بیلد پروداکشن

```bash
npm run build
```

#### تست و بررسی

```bash
npm run type-check  # بررسی TypeScript
npm run lint        # بررسی ESLint
npm run test        # اجرای تست‌ها
```

### 📝 فایل‌های مستندات

- `ARCHITECTURE.md` - معماری کلی پروژه
- `CSS_STRUCTURE.md` - ساختار و قوانین CSS
- `FONTS_GUIDE.md` - راهنمای استفاده از فونت‌ها
- `FONT_TEST.html` - تست فونت‌ها
- `PIXEL_FRAME_DEMO.html` - نمایش بوردر پیکسلی

### ⚠️ نکات مهم

1. **همیشه از دو کلاس فونت استفاده کنید**: `font-pixel` یا `font-normal`
2. **بوردرها**: از `pixel-frame` به‌جای `pixel-card` استفاده کنید
3. **رنگ‌ها**: از متغیرهای tailwind (`primary-*`, `secondary-*`) استفاده کنید
4. **RTL**: سیستم خودکار است، نیازی به تنظیم دستی ندارد
5. **Padding**: `pixel-frame` padding داخلی دارد، نیازی به اضافه کردن نیست

### 🐛 مشکلات برطرف شده

- ✅ اسکرول بیش از یک طبقه در هر حرکت
- ✅ اولویت نادرست فونت‌ها (Unixel قبل از Pixelify Sans)
- ✅ مشکل نمایش ترکیب فارسی/انگلیسی در RTL
- ✅ عدم وجود بوردر یکپارچه مشابه پوستر
- ✅ استایل‌های هاردکد و غیرقابل استفاده مجدد

### 🔄 تغییرات Breaking

1. **کلاس‌های قدیمی منسوخ شده:**
   - `pixel-text` → `font-pixel`
   - `font-unixel` → `font-pixel`
   - `font-iransans` → `font-normal`
   - `pixel-card` → `pixel-frame`

2. **ساختار CSS تغییر کرده:**
   - `pixel.css` دیگر استفاده نمی‌شود (deprecated)
   - باید `components.css` را import کنید

3. **Padding خودکار:**
   - `pixel-frame` padding داخلی دارد
   - padding‌های اضافی را حذف کنید

### 📊 آمار پروژه

- **تعداد کامپوننت‌ها**: 15+
- **تعداد صفحات**: 5
- **سایز بیلد**: ~51KB (JS) + ~33KB (CSS)
- **فونت‌های لوکال**: 30 فایل woff2
- **پشتیبانی مرورگر**: Modern browsers (ES2020+)

---

**تاریخ بروزرسانی**: 2025-01-19
**نسخه**: 0.1.1
**وضعیت**: ✅ آماده برای توسعه
