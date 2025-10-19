# 🎨 راهنمای استفاده از فونت‌ها

## سیستم فونت ساده و هوشمند

پروژه BugsBuzzy از یک سیستم فونت **دو سطحی** و **چندزبانه** استفاده می‌کند که به‌طور خودکار بین فونت‌های انگلیسی و فارسی تشخیص می‌دهد.

---

## 📝 دو کلاس فونت

### 1️⃣ `font-pixel`

**کاربرد**: عناوین، دکمه‌ها، منو، UI

**Font Stack**:

```
Pixelify Sans → Unixel → monospace
```

- **انگلیسی**: Pixelify Sans (اولویت اول)
- **فارسی**: Unixel (fallback خودکار)

**مثال**:

```jsx
<h1 className="font-pixel">BugsBuzzy</h1>
<h1 className="font-pixel">عنوان فارسی</h1>
<button className="font-pixel">Click Me</button>
<button className="font-pixel">کلیک کنید</button>
```

---

### 2️⃣ `font-normal`

**کاربرد**: متن‌های توضیحی، پاراگراف‌ها، محتوا

**Font Stack**:

```
Comic Sans MS → Comic Sans → IRANSansX → Tahoma → Arial → sans-serif
```

- **انگلیسی**: Comic Sans MS (اولویت اول)
- **فارسی**: IRANSansX (fallback خودکار)

**مثال**:

```jsx
<p className="font-normal">This is a description</p>
<p className="font-normal">این یک توضیح است</p>
```

---

## ✅ مثال‌های عملی

### کارت محصول

```jsx
<div className="pixel-card p-6">
  <h2 className="font-pixel text-2xl mb-4">کارگاه Unity</h2>
  <p className="font-normal text-gray-300">در این کارگاه با اصول توسعه بازی آشنا می‌شوید</p>
  <button className="pixel-btn pixel-btn-primary">ثبت‌نام</button>
</div>
```

### فرم ورود

```jsx
<div className="pixel-modal-content">
  <h2 className="font-pixel text-3xl mb-6">⚡ Login Portal</h2>
  <p className="font-normal text-gray-300 mb-6">Enter your email to continue</p>
  <input type="email" className="pixel-input font-pixel" placeholder="email@example.com" />
</div>
```

### منوی ناوبری

```jsx
<nav className="space-y-2">
  <Link to="/home" className="pixel-btn font-pixel">
    🏠 خانه
  </Link>
  <Link to="/workshops" className="pixel-btn font-pixel">
    🔬 کارگاه‌ها
  </Link>
</nav>
```

---

## 🎯 قوانین استفاده

| نوع المنت  | کلاس فونت     | مثال                                       |
| ---------- | ------------- | ------------------------------------------ |
| عنوان صفحه | `font-pixel`  | `<h1 className="font-pixel">`              |
| زیرعنوان   | `font-pixel`  | `<h2 className="font-pixel">`              |
| دکمه       | `font-pixel`  | `<button className="pixel-btn">` (خودکار)  |
| Input      | `font-pixel`  | `<input className="pixel-input">` (خودکار) |
| پاراگراف   | `font-normal` | `<p className="font-normal">`              |
| توضیحات    | `font-normal` | `<span className="font-normal">`           |
| Label      | `font-pixel`  | `<label className="font-pixel">`           |

---

## 💡 نکات مهم

1. ✅ **خودکار**: نیازی به نگرانی درباره زبان نیست - سیستم خودکار تشخیص می‌دهد
2. ✅ **ساده**: فقط دو کلاس: `font-pixel` و `font-normal`
3. ✅ **مرتب**: همه فونت‌ها در `global.css` تعریف شده‌اند
4. ✅ **پیکربندی**: Font stack در `tailwind.config.js` مدیریت می‌شود
5. ⚠️ **کامپوننت‌های pixel**: دکمه‌ها و input‌های پیکسلی خودکار `font-pixel` دارند

---

## 🛠 تنظیمات فونت (برای توسعه‌دهندگان)

### Tailwind Config

```js
// tailwind.config.js
fontFamily: {
  pixel: ['"Pixelify Sans"', '"Unixel"', 'monospace'],
  normal: ['"Comic Sans MS"', '"Comic Sans"', '"IRANSansX"', 'Tahoma', 'Arial', 'sans-serif'],
}
```

### Global CSS

```css
/* src/styles/global.css */

/* Pixelify Sans - از Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap');

/* Unixel - لوکال */
@font-face {
  font-family: 'Unixel';
  src: url('../assets/fonts/unixel-Regular.woff2') format('woff2');
}

/* IRANSansX - لوکال */
@font-face {
  font-family: 'IRANSansX';
  src: url('../assets/fonts/IRANSansX-Regular.woff2') format('woff2');
}
```

---

## ❌ اشتباهات رایج

### غلط ❌

```jsx
<h1 className="font-unixel">عنوان</h1>  // کلاس قدیمی
<p className="font-iransans">متن</p>    // کلاس قدیمی
<p className="font-pixel">توضیحات</p>   // نباید برای متن استفاده شود
```

### صحیح ✅

```jsx
<h1 className="font-pixel">عنوان</h1>    // عنوان = pixel
<p className="font-normal">متن</p>       // متن = normal
<p className="font-normal">توضیحات</p>   // توضیحات = normal
```

---

## 📚 منابع

- [Pixelify Sans در Google Fonts](https://fonts.google.com/specimen/Pixelify+Sans)
- [IRANSansX](https://github.com/rastikerdar/iran-sans-x)
- فایل Unixel: `src/assets/fonts/unixel-Regular.woff2`
