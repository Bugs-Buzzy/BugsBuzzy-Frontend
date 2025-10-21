import { forwardRef, useRef } from 'react';
import { FaGem } from 'react-icons/fa';

import bgSponsor from '@/assets/bkg-sponsor.png';
import RamzinexLogo from '@/assets/images/sponsors/ramzinex.png'; // مسیر لوگوی رمزینکس
import PixelFrame from '@/components/PixelFrame';
import { useScrollInterceptor } from '@/hooks/useScrollInterceptor';

const SponsorsFloor = forwardRef<HTMLElement>((props, ref) => {
  const messageRef = useRef<HTMLDivElement>(null);
  useScrollInterceptor(messageRef, {});

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat py-16 md:py-24 "
      style={{ backgroundImage: `url(${bgSponsor})` }}
    >
      <div className="flex flex-col items-center justify-center px-4 text-center max-w-6xl mx-auto ">
        {/* عنوان اصلی */}
        <h2 className="text-4xl md:text-6xl font-bold text-white font-pixel mb-12 flex items-center justify-center gap-4">
          <FaGem className="text-4xl md:text-6xl" />
          حامی
        </h2>

        {/* اسپانسر */}
        <PixelFrame className="bg-secondary-golden bg-opacity-30 p-6 md:px-8 md:py-4 flex flex-col items-center gap-6 transition-transform w-full md:w-3/4 ">
          {/* لوگو */}
          <img
            src={RamzinexLogo}
            alt="رمزینکس"
            className="w-48 md:w-64 h-auto object-contain mb-4"
          />

          {/* متن معرفی */}
          <div
            className="text-white text-sm md:text-base space-y-4 max-h-60 overflow-y-auto"
            ref={messageRef}
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-4">
              <h3 className="text-2xl md:text-2xl font-bold text-white mb-4">
                رمزینکس؛ صرافی منتخب بیش از ۴ میلیون کاربر ایرانی <></>
              </h3>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <p className="mb-4">
                از سال ۱۳۹۶، به‌عنوان یکی از پیشگامان آشنایی کاربران ایرانی با دنیای رمزارزها و
                آموزش مستمر اون‌ها برای بهره‌وری هرچه بیشتر در حوزه ارزهای دیجیتال فعالیت‌مون رو
                شروع کردیم. از آن زمان تا به امروز، به‌عنوان یک پلتفرم معاملاتی همتابه‌همتا
                (Peer-to-Peer) و دانش‌بنیان شناخته می‌شیم و در زمینه حجم معاملات، همیشه در ردیف
                بزرگ‌ترین صرافی‌های ارز دیجیتال ایران ایستادیم.
              </p>
              <p className="mb-4">
                ما با تکیه بر بازار معاملاتی پیشرفته و امن، بستری ساده، سریع و حرفه‌ای رو با استفاده
                از به‌روزترین پروتکل‌های امنیتی برای کاربران ایرانی فراهم کردیم و سرمایه‌گذاران
                می‌تونن با اطمینان خاطر و در کمال امنیت، ۳۵۰ رمزارز رو در بیش از ۵۰۰ بازار معاملاتی
                با کارمزد مناسب و شرایطی مطلوب فعالیت کنن.
              </p>
              <p>
                رمزینکس با ارائه ابزار و امکاناتی نظیر اهرم‌های معاملاتی و ربات‌های معامله‌گر، به
                همه کاربران، چه معامله‌گران حرفه‌ای و چه سرمایه‌گذاران بلندمدت، این امکان رو می‌ده
                که با رصد لحظه‌ای سود و زیان معاملات خودشون رو به‌طور بهینه مدیریت کنن. همچنین، با
                سرمایه‌گذاری در سبد‌های ارز دیجیتال رمزینکس مثل رمزفیکس و رمزباکس، کاربرها می‌تونن
                به‌صورت حرفه‌ای و هدفمند از فرصت‌های بازار بهره‌مند بشن.
              </p>
            </div>
          </div>

          {/* لینک فرصت‌های شغلی */}
          <a
            href="https://ramzinex.com/careers/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            فرصت‌های شغلی رمزینکس
          </a>
        </PixelFrame>
      </div>
    </section>
  );
});

SponsorsFloor.displayName = 'SponsorsFloor';

export default SponsorsFloor;
