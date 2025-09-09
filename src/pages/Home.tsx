import { Countdown } from '@/components/Countdown';
import { NewsletterForm } from '@/components/NewsletterForm';
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold tracking-widest animate-glow select-none drop-shadow-lg">
          BugsBuzzy
        </h1>
        <p className="mt-4 max-w-3xl text-base sm:text-lg md:text-xl text-primary-nonphoto font-light leading-relaxed px-2">
          رویداد بازی‌سازی و شکار باگ دانشگاه صنعتی شریف — جایی که خلاقیت، کدنویسی و هنر با یک چالش
          هیجان‌انگیز گره می‌خورند.
        </p>
        <Countdown target="2025-10-04T09:00:00" />
        <div className="max-w-4xl mx-auto mt-8 space-y-12 text-right px-2">
          <section className="bg-black/30 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm shadow-[0_0_25px_-5px_rgba(0,0,0,0.4)]">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-secondary-orangeCrayola">
              BugsBuzzy چیست؟
            </h2>
            <p className="text-primary-sky leading-8">
              BugsBuzzy یک رویداد بازی‌سازی (Game Jam) متمرکز بر «خلاقیت سریع»، «تیم‌سازی پویا» و
              «کیفیت فنی» است که در دانشکده مهندسی کامپیوتر دانشگاه صنعتی شریف برگزار می‌شود. تیم‌ها
              در مدت زمانی محدود با ارائه یک تم (Theme) غافلگیرکننده، ایده‌پردازی، طراحی، توسعه و
              بهینه‌سازی بازی خود را انجام می‌دهند. اما یک تفاوت ویژه داریم: «شکار باگ» بخشی از
              امتیاز شماست! هر چه بازی شما پایدارتر، هوشمندانه‌تر و تمیزتر باشد، شانس بیشتری برای
              درخشش دارید.
            </p>
          </section>
          <section className="bg-black/25 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-secondary-orangeCrayola">
              چرا شرکت کنم؟
            </h3>
            <ul className="list-disc list-inside space-y-2 text-primary-sky leading-7 marker:text-secondary-orangeCrayola">
              <li>فرصت همکاری بین برنامه‌نویسان، آرتیست‌ها، طراحان، آهنگ‌سازان و تسترها</li>
              <li>تمرین تصمیم‌گیری سریع و مدیریت زمان در چرخه کامل تولید بازی</li>
              <li>تمرکز ویژه بر کیفیت کد، پایداری و Debugging حرفه‌ای</li>
              <li>منتورینگ توسط افراد با تجربه در صنعت و آکادمیا</li>
              <li>شبکه‌سازی و ساخت ارتباطات ماندگار برای آینده حرفه‌ای</li>
            </ul>
          </section>
          <section className="bg-black/25 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-secondary-orangeCrayola">
              محورهای رویداد
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-primary-sky">
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 backdrop-blur">
                <p className="font-semibold mb-1">طراحی و ایده‌پردازی (Game Design)</p>
                <p className="text-sm leading-6">روایت، مکانیک‌های اصلی، تجربه کاربر</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 backdrop-blur">
                <p className="font-semibold mb-1">برنامه‌نویسی و مهندسی</p>
                <p className="text-sm leading-6">ساختار فنی، معماری، بهینه‌سازی و مدیریت حافظه</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 backdrop-blur">
                <p className="font-semibold mb-1">گرافیک و آرت</p>
                <p className="text-sm leading-6">پیکسل آرت، 2D/3D، UI و انیمیشن سبک‌مند</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 backdrop-blur">
                <p className="font-semibold mb-1">صدا و موسیقی</p>
                <p className="text-sm leading-6">طراحی افکت، موسیقی تعاملی، حس فضا</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 backdrop-blur">
                <p className="font-semibold mb-1">کیفیت، تست و Debugging</p>
                <p className="text-sm leading-6">شناسایی گلوگاه‌ها، پایداری، گزارش باگ</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-white/5 backdrop-blur">
                <p className="font-semibold mb-1">خلاقیت افزوده با AI</p>
                <p className="text-sm leading-6">الهام‌گیری، ابزارهای هوشمند، کمک به تولید محتوا</p>
              </div>
            </div>
          </section>
          <section className="bg-black/25 rounded-xl p-5 md:p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-secondary-orangeCrayola">
              زمان و مکان
            </h3>
            <p className="text-primary-sky leading-8">
              شروع شمارش معکوس در <span className="font-semibold">۱۳ مهر ۱۴۰۴ (۴ اکتبر ۲۰۲۵)</span>.
              محل برگزاری:{' '}
              <span className="font-semibold">دانشگاه صنعتی شریف – دانشکده مهندسی کامپیوتر</span>.
              ظرفیت محدود است؛ اولویت با ثبت‌نام زودهنگام خواهد بود.
            </p>
            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm text-primary-sky/80">
              <div className="p-3 rounded bg-black/25 border border-white/5">
                <p className="font-semibold mb-1">آغاز</p>
                <p>۰۹:۰۰ — معرفی تم</p>
              </div>
              <div className="p-3 rounded bg-black/25 border border-white/5">
                <p className="font-semibold mb-1">منتورشیپ</p>
                <p>بازدید دوره‌ای تیم‌ها</p>
              </div>
              <div className="p-3 rounded bg-black/25 border border-white/5">
                <p className="font-semibold mb-1">اختتامیه</p>
                <p>ارائه، داوری و تقدیر</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-primary-sky/60">
              * برنامه دقیق و فرم ثبت‌نام به‌زودی منتشر می‌شود. در خبرنامه عضو شوید تا اولین نفر
              باشید که مطلع می‌شوید.
            </p>
          </section>
        </div>
        <div className="mt-16 w-full max-w-xl bg-black/30 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <p className="mb-4 text-primary-sky text-sm sm:text-base leading-7">
            برای دریافت اطلاعیه آغاز ثبت‌نام، تم، جوایز و معرفی منتورها ایمیل خود را وارد کنید.
          </p>
          <NewsletterForm />
          <div className="mt-6">
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
