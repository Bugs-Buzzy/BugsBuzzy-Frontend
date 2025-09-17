import { Countdown } from '@/components/Countdown';
import { ParticlesCanvas } from '@/components/ParticlesCanvas';
import { SocialLinks } from '@/components/SocialLinks';

export function Home() {
  return (
    <div
      className="container mx-auto px-4 flex flex-col items-center justify-start pt-28 md:pt-36 pb-20 min-h-screen text-center relative text-primary-columbia overflow-hidden"
      dir="rtl"
      lang="fa"
    >
      <ParticlesCanvas />
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* === Logo === */}
        <img
          src={'/src/assets/logo.svg'}
          alt="لوگوی رویداد باگزبازی"
          className="w-24 h-24 md:w-32 md:h-32 mb-6 animate-pulse-slow"
        />

        {/* Hero Section */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold tracking-widest animate-glow select-none drop-shadow-lg">
          BugsBuzzy
        </h1>
        <p className="mt-4 max-w-3xl text-base sm:text-lg md:text-xl text-primary-nonphoto font-light leading-relaxed px-2">
          بزرگترین رویداد بازی‌سازی دانشگاه صنعتی شریف؛ دو رقابت، یک هدف: ساختن، یادگرفتن و
          شبکه‌سازی در دنیای بازی.
        </p>

        {/* Countdown Timer */}
        <Countdown target="2025-10-30T09:00:00" />

        <div className="max-w-4xl mx-auto mt-8 space-y-12 text-right px-2">
          {/* Section: What is BugsBuzzy? */}
          <section className="bg-black/30 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm shadow-[0_0_25px_-5px_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-secondary-orangeCrayola">
              «باگزبازی» چیست؟
            </h2>
            <p className="text-primary-sky leading-8">
              باگزبازی یک فستیوال بازی‌سازی است که توسط انجمن علمی دانشکده مهندسی کامپیوتر شریف
              برگزار می‌شود. ما با دو بخش رقابتی مجزا، فضایی فراهم کرده‌ایم تا هر کسی، با هر سطح از
              تجربه، بتواند لذت خلق یک بازی را تجربه کند. از کارگاه‌های آموزشی تخصصی گرفته تا
              رقابت‌های تیمی پرانرژی، باگزبازی فرصتی بی‌نظیر برای یادگیری، ساخت و ورود به صنعت
              بازی‌سازی ایران است.
            </p>
          </section>

          {/* Section: In-person Competition */}
          <section className="bg-black/25 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-secondary-orangeCrayola">
              رقابت حضوری: اولین قدم‌ها در دنیای بازی
            </h3>
            <p className="text-primary-sky leading-8 mb-4">
              این بخش برای کسانی طراحی شده که می‌خواهند ساخت بازی را در یک محیط پویا و تیمی تجربه
              کنند، حتی اگر دانش قبلی نداشته باشند. ما یک زیرساخت بازی آماده کرده‌ایم و شما در
              تیم‌های ۲ تا ۳ نفره، طی دو روز هیجان‌انگیز، مراحل جدیدی برای آن خلق می‌کنید. این
              رقابت، ترکیبی از یک مسابقه و یک کارگاه عملی فشرده است.
            </p>
            <ul className="list-disc list-inside space-y-2 text-primary-sky leading-7 marker:text-secondary-orangeCrayola">
              <li>
                <span className="font-semibold">مکان:</span> دانشکده مهندسی کامپیوتر، دانشگاه صنعتی
                شریف
              </li>
              <li>
                <span className="font-semibold">مخاطبان:</span> دانشجویان و تمام علاقه‌مندان به شروع
                بازی‌سازی
              </li>
              <li>
                <span className="font-semibold">هدف:</span> تجربه عملی فرآیند توسعه بازی و خلق یک
                بازی بزرگ و مشترک
              </li>
            </ul>
          </section>

          {/* Section: Virtual Competition */}
          <section className="bg-black/25 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-secondary-orangeCrayola">
              رقابت مجازی: چالش بزرگ بازی‌سازان
            </h3>
            <p className="text-primary-sky leading-8 mb-4">
              یک گیم‌جم آنلاین، ساختارمند و حرفه‌ای برای تیم‌های بازی‌سازی در سراسر ایران. تیم‌ها
              حدود ۱۰ روز فرصت دارند تا بر اساس تم اعلام شده، یک بازی کامل را از صفر تا صد بسازند.
              در این مسیر، منتورها و داوران ما در کنار تیم‌ها خواهند بود تا به آن‌ها در ساخت
              بازی‌های بهتر کمک کنند. اگر به دنبال یک چالش جدی و رقابت در سطح ملی هستید، اینجا جای
              شماست.
            </p>
            <ul className="list-disc list-inside space-y-2 text-primary-sky leading-7 marker:text-secondary-orangeCrayola">
              <li>
                <span className="font-semibold">مکان:</span> آنلاین - از سراسر ایران
              </li>
              <li>
                <span className="font-semibold">مخاطبان:</span> تیم‌های مستقل، دانشجویان و فعالان
                حوزه بازی‌سازی
              </li>
              <li>
                <span className="font-semibold">هدف:</span> پر کردن خلأ یک گیم‌جم استاندارد ملی و
                شناسایی استعدادهای برتر
              </li>
            </ul>
          </section>

          {/* Section: Timeline */}
          <section className="bg-black/30 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-secondary-orangeCrayola">
              خط زمانی رویداد
            </h2>
            <div className="space-y-4 relative">
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-semibold text-secondary-orangeCrayola/80">
                  ۲۶ مهر
                </div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-white/10">
                  آغاز ثبت‌نام هر دو رقابت
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-semibold text-secondary-orangeCrayola/80">
                  ۲۹ مهر
                </div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-white/10">
                  شروع کارگاه‌های آموزشی
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-semibold text-secondary-orangeCrayola/80">
                  ۷ آبان
                </div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-white/10">
                  پایان ثبت‌نام رقابت حضوری
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-bold text-secondary-orangeCrayola">
                  ۸ و ۹ آبان
                </div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-secondary-orangeCrayola/40">
                  برگزاری رقابت حضوری
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-semibold text-secondary-orangeCrayola/80">
                  ۱۴ آبان
                </div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-white/10">
                  پایان ثبت‌نام و افتتاحیه رقابت مجازی
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-semibold text-secondary-orangeCrayola/80">
                  ۲۴ آبان
                </div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-white/10">
                  پایان مهلت ارسال آثار رقابت مجازی
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-28 text-left font-bold text-secondary-orangeCrayola">۲۸ آبان</div>
                <div className="flex-1 p-3 rounded-lg bg-black/40 border border-secondary-orangeCrayola/40">
                  اختتامیه بزرگ و اهدای جوایز
                </div>
              </div>
            </div>
            <p className="mt-5 text-xs text-primary-sky/60">
              * برنامه دقیق کارگاه‌ها و فرم‌های ثبت‌نام به‌زودی اعلام می‌شود. برای اطلاع سریع‌تر، به
              کانال تلگرام ما بپیوندید.
            </p>
          </section>
        </div>

        {/* Telegram and Social Links Section */}
        <div className="mt-16 w-full max-w-xl bg-black/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <p className="mb-5 text-primary-sky text-sm sm:text-base leading-7">
            برای دریافت آخرین اخبار، اطلاعیه کارگاه‌ها، معرفی داوران و اعلام تم رقابت مجازی، به
            کانال تلگرام رسمی رویداد بپیوندید.
          </p>
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}

export default Home;
