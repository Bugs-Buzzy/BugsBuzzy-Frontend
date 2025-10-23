# معماری سیستم رقابت‌ها

این سند معماری کامپوننت‌های سیستم ثبت‌نام و مدیریت رقابت‌ها را توضیح می‌دهد.

## ساختار کلی

```
src/
├── components/
│   └── competition/
│       ├── CompetitionLayout.tsx      // Layout اصلی با progress bar
│       ├── ProgressBar.tsx            // خط پیشرفت با navigation
│       └── phases/
│           ├── PaymentPhase.tsx       // فاز پرداخت (قابل استفاده مجدد)
│           ├── TeamPhase.tsx          // فاز تیم‌سازی (قابل استفاده مجدد)
│           └── PlaceholderPhase.tsx   // فازهای آینده
│
└── pages/panel/
    ├── InPersonCompetition.tsx        // رقابت حضوری
    └── GameJamCompetition.tsx         // گیم‌جم مجازی
```

## فازهای رقابت

### رقابت حضوری:

```
فاز 0: پرداخت (اجباری) → فاز 1: تیم‌سازی → فاز 2-5: مراحل رقابت
```

### گیم‌جم مجازی:

```
فاز 0: پرداخت (اختیاری) → فاز 1: تیم‌سازی → فاز 2-5: مراحل رقابت
```

## کامپوننت‌ها

### 1. CompetitionLayout

**مسئولیت:**

- نمایش progress bar
- مدیریت navigation بین فازها
- نمایش اطلاعات کلی (نام، وضعیت)

**Props:**

```typescript
interface CompetitionLayoutProps {
  title: string; // 'رقابت حضوری' یا 'گیم‌جم مجازی'
  icon: string; // ایموجی
  phases: Phase[]; // لیست فازها
  currentPhase: number; // فاز فعلی
  onPhaseChange: (phase: number) => void;
  children: React.ReactNode; // محتوای فاز فعلی
}
```

### 2. ProgressBar

**مسئولیت:**

- نمایش visual خط پیشرفت
- نمایش وضعیت هر فاز (قفل، در حال انجام، تکمیل شده)
- امکان کلیک برای جابجایی (اگر مجاز باشد)

**Props:**

```typescript
interface Phase {
  id: number;
  title: string;
  icon: string;
  status: 'locked' | 'current' | 'completed' | 'available';
  isClickable: boolean;
}

interface ProgressBarProps {
  phases: Phase[];
  currentPhase: number;
  onPhaseClick: (phaseId: number) => void;
}
```

### 3. PaymentPhase

**مسئولیت:**

- نمایش فاکتور قیمت
- checkbox های آیتم‌های اضافی (ناهار روز اول/دوم)
- کد تخفیف
- دکمه پرداخت

**Props:**

```typescript
interface PaymentPhaseProps {
  competitionType: 'inperson' | 'gamejam';
  baseItem: string; // 'inperson' یا 'gamejam'
  additionalItems: {
    // آیتم‌های اضافی (ناهارها)
    id: string;
    label: string;
    required?: boolean;
  }[];
  isSkippable: boolean; // فقط برای گیم‌جم true
  onPaymentComplete: () => void;
  onSkip?: () => void;
}
```

### 4. TeamPhase

**مسئولیت:**

- ساخت تیم یا join به تیم
- نمایش اعضای تیم
- مدیریت تیم (leave/disband)

**Props:**

```typescript
interface TeamPhaseProps {
  teamType: 'inperson' | 'gamejam';
  maxMembers: number; // 3 برای inperson، 6 برای gamejam
  minMembers: number; // 3 برای inperson، 1 برای gamejam
  requirePayment: boolean; // true برای inperson، false برای gamejam
  canCreateTeam: boolean; // بستگی به پرداخت داره
  canJoinTeam: boolean; // همیشه true
}
```

### 5. PlaceholderPhase

**مسئولیت:**

- نمایش "Coming Soon" برای فازهای آینده
- نمایش تاریخ و زمان فاز

**Props:**

```typescript
interface PlaceholderPhaseProps {
  phaseNumber: number;
  phaseName: string;
  startDate?: string;
  description?: string;
}
```

## فلوهای مختلف

### رقابت حضوری:

```typescript
const inPersonPhases: Phase[] = [
  { id: 0, title: 'پرداخت', icon: '💰', status: 'current', isClickable: false },
  { id: 1, title: 'تیم‌سازی', icon: '👥', status: 'locked', isClickable: false },
  { id: 2, title: 'فاز اول', icon: '🎯', status: 'locked', isClickable: false },
  { id: 3, title: 'فاز دوم', icon: '🎮', status: 'locked', isClickable: false },
  { id: 4, title: 'فاز سوم', icon: '🏁', status: 'locked', isClickable: false },
];

// Logic:
// - فاز 0: پرداخت اجباری
// - فاز 1: فقط بعد از پرداخت باز میشه
// - فاز 2+: بعد از تکمیل تیم 3 نفره باز میشن
// - می‌تونی برگردی فاز 0 و ناهار اضافه کنی
```

### گیم‌جم مجازی:

```typescript
const gameJamPhases: Phase[] = [
  { id: 0, title: 'پرداخت', icon: '💰', status: 'current', isClickable: false },
  { id: 1, title: 'تیم‌سازی', icon: '👥', status: 'available', isClickable: true },
  { id: 2, title: 'فاز اول', icon: '🎯', status: 'locked', isClickable: false },
  { id: 3, title: 'فاز دوم', icon: '🎮', status: 'locked', isClickable: false },
  { id: 4, title: 'فاز سوم', icon: '🏁', status: 'locked', isClickable: false },
];

// Logic:
// - فاز 0: اختیاری - میشه skip کرد
// - فاز 1: همیشه available
//   - اگه پرداخت نکرده: فقط join
//   - اگه پرداخت کرده: create یا join
// - فاز 2+: بعد از تشکیل تیم باز میشن
// - اگه بعداً پرداخت کنی، نمی‌تونی دیگه join کنی (فقط create)
```

## Data Flow

### State Management:

```typescript
// در صفحه اصلی (InPersonCompetition یا GameJamCompetition)
const [currentPhase, setCurrentPhase] = useState(0);
const [phaseData, setPhaseData] = useState({
  hasPaid: false,
  hasTeam: false,
  teamId: null,
  additionalPayments: {
    thursday_lunch: false,
    friday_lunch: false,
  },
});

// هر phase خودش state مربوط به خودش رو مدیریت می‌کنه
// ولی از props برای communication با parent استفاده می‌کنه
```

## Design Pattern

### Compound Component Pattern:

```tsx
<CompetitionLayout
  title="رقابت حضوری"
  icon="🏆"
  phases={phases}
  currentPhase={currentPhase}
  onPhaseChange={handlePhaseChange}
>
  {currentPhase === 0 && (
    <PaymentPhase
      competitionType="inperson"
      baseItem="inperson"
      additionalItems={[
        { id: 'thursday_lunch', label: 'ناهار روز اول' },
        { id: 'friday_lunch', label: 'ناهار روز دوم' },
      ]}
      isSkippable={false}
      onPaymentComplete={handlePaymentComplete}
    />
  )}

  {currentPhase === 1 && (
    <TeamPhase
      teamType="inperson"
      maxMembers={3}
      minMembers={3}
      requirePayment={true}
      canCreateTeam={phaseData.hasPaid}
      canJoinTeam={true}
    />
  )}

  {currentPhase >= 2 && (
    <PlaceholderPhase phaseNumber={currentPhase} phaseName={`فاز ${currentPhase - 1}`} />
  )}
</CompetitionLayout>
```

## مزایا

1. **Reusability**: کامپوننت‌ها قابل استفاده در هر دو رقابت هستند
2. **Maintainability**: هر فاز یک فایل جداگانه
3. **Scalability**: اضافه کردن فاز جدید آسان است
4. **Consistency**: UI و UX یکپارچه در همه جا
5. **Separation of Concerns**: هر کامپوننت یک مسئولیت واحد دارد

## Next Steps

1. ساخت کامپوننت‌های پایه (ProgressBar, CompetitionLayout)
2. ریفکتور PaymentPhase از کد موجود
3. ریفکتور TeamPhase از کد موجود
4. پیاده‌سازی InPersonCompetition جدید
5. پیاده‌سازی GameJamCompetition جدید
6. تست و بهینه‌سازی
