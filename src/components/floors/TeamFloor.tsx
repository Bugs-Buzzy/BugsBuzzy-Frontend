import { forwardRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import bgStaff from '@/assets/bkg-staff.png';
import PixelFrame from '@/components/PixelFrame';

const teams = {
  'تیم دبیران': [
    { id: 1, name: 'امیررضا جعفری', role: 'دبیر', image: 'src/assets/images/team/1.jpg' },
    { id: 2, name: 'امیرمهدی طهماسبی', role: 'نائب دبیر', image: 'src/assets/images/team/2.jpg' },
    { id: 3, name: 'علیرضا مهندسی', role: 'مسئول هماهنگی', image: 'src/assets/images/team/3.jpg' },
  ],
  'تیم علمی': [
    { id: 4, name: 'مهدی علی‌نژاد', role: 'مسئول تیم علمی', image: 'src/assets/images/team/4.jpg' },
    { id: 5, name: 'پردیس مرادی', role: '', image: 'src/assets/images/team/5.jpg' },
    { id: 6, name: 'ابوالفضل کاشی', role: '', image: 'src/assets/images/team/6.jpg' },
    { id: 7, name: 'علیرضا قلیان فروشان', role: '', image: 'src/assets/images/team/7.jpg' },
    { id: 8, name: 'محمدعارف زارع‌زاده', role: '', image: 'src/assets/images/team/8.jpg' },
    { id: 9, name: 'ریحانه ابراهیم زاده', role: '', image: 'src/assets/images/team/9.jpg' },
    { id: 52, name: 'سید محمدمهدی حسینی', role: '', image: 'src/assets/images/team/52.jpg' },
    { id: 10, name: 'محمدحسین اسلامی', role: '', image: 'src/assets/images/team/10.jpeg' },
    { id: 11, name: 'ملیکا علیزاده', role: '', image: 'src/assets/images/team/11.jpg' },
    { id: 12, name: 'محمدرضا منعمیان', role: '', image: 'src/assets/images/team/12.jpg' },
    { id: 13, name: 'سپهر کلانکی', role: '', image: 'src/assets/images/team/13.jpg' },
    { id: 14, name: 'سینا فعالیت', role: '', image: 'src/assets/images/team/14.png' },
    { id: 15, name: 'محمدامین عباس‌فر', role: '', image: 'src/assets/images/team/15.jpeg' },
  ],
  'تیم فنی': [
    {
      id: 16,
      name: 'امیرحسین محمدزاده',
      role: 'مسئول تیم فنی',
      image: 'src/assets/images/team/member1.jpg',
    },
    { id: 17, name: 'محمدامین کوهی', role: '', image: 'src/assets/images/team/17.jpeg' },
    { id: 18, name: 'امیرحسین صوری', role: '', image: 'src/assets/images/team/18.jpg' },
    { id: 19, name: 'حسین زاهدی ادیب', role: '', image: 'src/assets/images/team/19.jpg' },
  ],
  'تیم اجرایی': [
    {
      id: 20,
      name: 'عرفان تیموری',
      role: 'مسئول تیم اجرایی',
      image: 'src/assets/images/team/20.jpg',
    },
    { id: 21, name: 'مهبد خالتی', role: '', image: 'src/assets/images/team/21.jpg' },
    { id: 22, name: 'زهرا قصابی', role: '', image: 'src/assets/images/team/22.jpg' },
    { id: 23, name: 'سهیل سیاح ورگ', role: '', image: 'src/assets/images/team/23.jpg' },
    { id: 24, name: 'سارا قضاوی', role: '', image: 'src/assets/images/team/24.jpeg' },
    { id: 25, name: 'امیرحسین شایان', role: '', image: 'src/assets/images/team/25.jpg' },
    { id: 26, name: 'الینا هژبری', role: '', image: 'src/assets/images/team/26.png' },
    { id: 27, name: 'آرمان انجیدنی', role: '', image: 'src/assets/images/team/27.jpg' },
    { id: 28, name: 'کیمیا علوی', role: '', image: 'src/assets/images/team/28.jpeg' },
    { id: 29, name: 'نوید آتشین‌بار', role: '', image: 'src/assets/images/team/29.jpeg' },
    { id: 30, name: 'نیلا کشاورز', role: '', image: 'src/assets/images/team/30.jpg' },
    { id: 31, name: 'پوریا غفوری', role: '', image: 'src/assets/images/team/31.jpg' },
    { id: 32, name: 'امیرحسین شهیدی', role: '', image: 'src/assets/images/team/32.jpg' },
    { id: 33, name: 'سیده شقایق میرجلیلی', role: '', image: 'src/assets/images/team/33.jpeg' },
    { id: 34, name: 'نیما قدیرنیا', role: '', image: 'src/assets/images/team/34.jpg' },
    { id: 35, name: 'امیرمهدی هدایتی‌پور', role: '', image: 'src/assets/images/team/35.jpg' },
  ],
  'تیم گرافیک و سوشال': [
    { id: 36, name: 'نرگس کاری', role: 'مسئول تیم', image: 'src/assets/images/team/36.jpg' },
    { id: 37, name: 'سیداحمد موسوی‌اول', role: '', image: 'src/assets/images/team/37.jpg' },
    { id: 38, name: 'محمد مصیبی', role: '', image: 'src/assets/images/team/38.jpg' },
    { id: 39, name: 'معین آعلی', role: '', image: 'src/assets/images/team/39.jpg' },
    { id: 40, name: 'سید معین حسینی', role: '', image: 'src/assets/images/team/40.jpg' },
    { id: 41, name: 'آرش شاه‌حسینی', role: '', image: 'src/assets/images/team/41.png' },
    { id: 42, name: 'فاطمه نیلفروشان', role: '', image: 'src/assets/images/team/42.jpeg' },
  ],
  'تیم اسپانسرشیپ': [
    {
      id: 43,
      name: 'امید حیدری',
      role: 'مسئول تیم اسپانسرشیپ',
      image: 'src/assets/images/team/43.jpg',
    },
    { id: 44, name: 'محمدحسن بیاتی‌نیا', role: '', image: 'src/assets/images/team/44.jpeg' },
    { id: 45, name: 'آروین بقال اصل', role: '', image: 'src/assets/images/team/45.jpg' },
    { id: 46, name: 'خورشید باهوش', role: '', image: 'src/assets/images/team/46.jpg' },
    { id: 47, name: 'حسنا شاه‌حیدری', role: '', image: 'src/assets/images/team/47.jpg' },
  ],
  'تیم مارکتینگ': [
    { id: 48, name: 'سعید فراتی کاشانی', role: '', image: 'src/assets/images/team/48.jpg' },
    { id: 49, name: 'محمد ارمیا قاصری', role: '', image: 'src/assets/images/team/49.jpg' },
    { id: 50, name: 'صهیب صادقی', role: '', image: 'src/assets/images/team/50.jpg' },
    { id: 51, name: 'امیرمحمد شربتی', role: '', image: 'src/assets/images/team/51.jpg' },
  ],
} as const;

type TeamName = keyof typeof teams;

const TeamFloor = forwardRef<HTMLElement>((props, ref) => {
  const teamNames = Object.keys(teams) as TeamName[];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTeam = teamNames[currentIndex];

  const nextTeam = () => setCurrentIndex((prev) => (prev + 1) % teamNames.length);
  const prevTeam = () => setCurrentIndex((prev) => (prev === 0 ? teamNames.length - 1 : prev - 1));

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgStaff})` }}
    >
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
        {/* عنوان اصلی */}
        <h1 className="text-4xl md:text-6xl font-bold text-white font-pixel mb-8">تیم برگزاری</h1>

        {/* کنترل انتخاب تیم */}
        <div className="flex items-center justify-center gap-6 mb-8 text-white font-pixel">
          <button
            onClick={prevTeam}
            className="p-3 rounded-full bg-gray-900 hover:bg-gray-700 transition"
            aria-label="قبلی"
          >
            <FaChevronRight className="text-2xl" />
          </button>

          <h2 className="text-2xl md:text-4xl font-bold">{currentTeam}</h2>

          <button
            onClick={nextTeam}
            className="p-3 rounded-full bg-gray-900 hover:bg-gray-700 transition"
            aria-label="بعدی"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
        </div>

        {/* اعضای تیم با مرکز چین و قاب ثابت */}
        <div className="w-full max-w-5xl h-[90vh] p-4 overflow-y-auto">
          <div className={`flex flex-wrap justify-center gap-1`}>
            {teams[currentTeam].map((member) => (
              <PixelFrame
                key={member.id}
                className="bg-gray-800 hover:scale-105 transition-transform w-50 h-70 flex flex-col items-center justify-start p-3"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  width={760}
                  height={760}
                  className="w-40 h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="text-xs md:text-lg font-bold text-white mb-1 font-pixel text-center">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-xs md:text-xs font-normal text-center">
                  {member.role}
                </p>
              </PixelFrame>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

TeamFloor.displayName = 'TeamFloor';

export default TeamFloor;
