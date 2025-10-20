import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import bgStaff from '@/assets/bkg-staff.png';
import TeamMemberCard from '@/components/team/TeamMemberCard';

const teams = {
  'هسته مرکزی': [
    {
      id: 1,
      name: 'امیررضا جعفری',
      role: 'دبیر',
      image: '1.jpg',
      linkedin: 'https://www.linkedin.com/in/amirreza-jafari-b86315285',
      github: '',
      telegram: 'https://t.me/A_R_J_8_3',
    },
    {
      id: 2,
      name: 'امیرمهدی طهماسبی',
      role: 'نائب دبیر',
      image: '2.jpg',
      linkedin: 'https://www.linkedin.com/in/amirmahdi-tahmasebi-b3386928a/',
      github: 'https://github.com/ta-tahmasebi',
      telegram: '',
    },
    {
      id: 3,
      name: 'علیرضا مهندسی',
      role: 'مسئول هماهنگی',
      image: '3.jpg',
      linkedin: 'https://www.linkedin.com/in/alireza-mohandesi-181567321',
      github: 'https://github.com/alirezamohandesi',
      telegram: 'https://t.me/alimoh2486',
    },
    {
      id: 4,
      name: 'مهدی علی‌نژاد',
      role: 'رابط انجمن علمی',
      image: '4.jpg',
      linkedin: 'https://www.linkedin.com/in/mahdi-ali-nejad',
      github: 'https://github.com/Soilorian',
      telegram: 'https://t.me/Ma8hd2i',
    },
  ],
  'تیم علمی': [
    {
      id: 4,
      name: 'مهدی علی‌نژاد',
      role: 'مسئول تیم علمی',
      image: '4.jpg',
      linkedin: 'https://www.linkedin.com/in/mahdi-ali-nejad',
      github: 'https://github.com/Soilorian',
      telegram: 'https://t.me/Ma8hd2i',
    },
    {
      id: 5,
      name: 'پردیس مرادی',
      role: 'مسئول کارگاه‌ها',
      image: '5.jpg',
      linkedin: 'https://www.linkedin.com/in/pardis-moradi-393b17372/',
      github: 'https://github.com/Pardis-Moradi',
      telegram: '',
    },
    {
      id: 10,
      name: 'محمدحسین اسلامی',
      role: 'مسئول گیم‌جم',
      image: '10.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 8,
      name: 'محمدعارف زارع‌زاده',
      role: 'مسئول تیم داوری',
      image: '8.jpg',
      linkedin: '',
      github: 'https://github.com/arefzarezadeh',
      telegram: '',
    },
    {
      id: 6,
      name: 'ابوالفضل کاشی',
      role: 'عضو تیم علمی',
      image: '6.jpg',
      linkedin: 'https://www.linkedin.com/in/abolfazl-kashi',
      github: '',
      telegram: '',
    },
    {
      id: 7,
      name: 'علیرضا قلیان‌فروشان',
      role: 'عضو تیم علمی',
      image: '7.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 9,
      name: 'ریحانه ابراهیم‌زاده',
      role: 'عضو تیم علمی',
      image: '9.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 52,
      name: 'سید محمدمهدی حسینی',
      role: 'عضو تیم علمی',
      image: '52.jpg',
      linkedin: '',
      github: 'https://github.com/teiburs',
      telegram: 'https://t.me/teibur',
    },
    {
      id: 11,
      name: 'ملیکا علیزاده',
      role: 'عضو تیم علمی',
      image: '11.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 12,
      name: 'محمدرضا منعمیان',
      role: 'عضو تیم علمی',
      image: '12.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 13,
      name: 'سپهر کلانکی',
      role: 'عضو تیم علمی',
      image: '13.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 14,
      name: 'سینا فعالیت',
      role: 'عضو تیم علمی',
      image: '14.jpg',
      linkedin: '',
      github: 'https://github.com/Sanctious',
      telegram: 'https://t.me/sanctious1',
    },
    {
      id: 15,
      name: 'محمدامین عباس‌فر',
      role: 'عضو تیم علمی',
      image: '15.jpg',
      linkedin: 'https://www.linkedin.com/in/abbasfar',
      github: '',
      telegram: '',
    },
  ],
  'تیم فنی': [
    {
      id: 16,
      name: 'امیرحسین محمدزاده',
      role: 'مسئول تیم فنی و زیرساخت',
      image: '16.jpg',
      linkedin: 'https://linkedin.com/in/ahmz1833',
      github: 'https://github.com/ahmz1833',
      telegram: 'https://t.me/ahmz1833',
    },
    {
      id: 17,
      name: 'محمدامین کوهی',
      role: 'بک‌اند',
      image: '17.jpg',
      linkedin: '',
      github: 'https://github.com/orgs/Bugs-Buzzy/people/MohammadAminKoohi',
      telegram: 'https://t.me/ma_koohi',
    },
    {
      id: 18,
      name: 'امیرحسین صوری',
      role: 'بک‌اند و فرانت‌اند',
      image: '18.jpg',
      linkedin: 'https://linkedin.com/in/amirhossein-souri',
      github: 'https://github.com/Amir14Souri',
      telegram: '',
    },
    {
      id: 19,
      name: 'حسین زاهدی‌ادیب',
      role: 'بک‌اند و فرانت‌اند',
      image: '19.jpg',
      linkedin: 'https://www.linkedin.com/in/hossein-zahedi-adib-69b16231b/',
      github: 'https://github.com/zahediadib',
      telegram: 'https://t.me/zahediadib',
    },
    {
      id: 36,
      name: 'نرگس کاری',
      role: 'فرانت‌اند',
      image: '36.jpg',
      linkedin: 'https://www.linkedin.com/in/narges-karidolatabadi-a30348291',
      github: 'https://github.com/nargeskari',
      telegram: 'https://t.me/NargesKari',
    },
    {
      id: 8,
      name: 'محمدعارف زارع‌زاده',
      role: 'فرانت‌اند',
      image: '8.jpg',
      linkedin: '',
      github: 'https://github.com/arefzarezadeh',
      telegram: '',
    },
    {
      id: 11,
      name: 'ملیکا علیزاده',
      role: 'مسئول مینی‌گیم',
      image: '11.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
  ],
  'تیم اجرایی': [
    {
      id: 20,
      name: 'عرفان تیموری',
      role: 'مسئول اجرایی',
      image: '20.jpg',
      linkedin: 'https://www.linkedin.com/in/erfan-teymouri-49351b389/',
      github: '',
      telegram: '',
    },
    {
      id: 21,
      name: 'مهبد خالتی',
      role: 'جانشین مسئول اجرایی',
      image: '21.jpg',
      linkedin: 'https://www.linkedin.com/in/mahbod-khaleti-a21294329/',
      github: '',
      telegram: '',
    },
    {
      id: 22,
      name: 'زهرا قصابی',
      role: 'جانشین مسئول اجرایی',
      image: '22.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 23,
      name: 'سهیل سیاح‌ورگ',
      role: 'مسئول تدارکات',
      image: '23.jpg',
      linkedin: 'https://www.linkedin.com/in/soheil-sayah-varg-3236b228a/',
      github: '',
      telegram: '',
    },
    {
      id: 24,
      name: 'سارا قضاوی',
      role: 'مسئول دکور',
      image: '24.jpg',
      linkedin: 'https://www.linkedin.com/in/sara-ghazavi-337047320/',
      github: '',
      telegram: '',
    },
    {
      id: 25,
      name: 'امیرحسین شایان',
      role: 'عضو تیم اجرایی',
      image: '25.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 26,
      name: 'الینا هژبری',
      role: 'عضو تیم اجرایی',
      image: '26.jpg',
      linkedin: 'https://www.linkedin.com/in/elina-hozhabri-07aa50367/',
      github: 'https://github.com/ElinaH83',
      telegram: 'https://t.me/ELN2004',
    },
    {
      id: 27,
      name: 'آرمان انجیدنی',
      role: 'عضو تیم اجرایی',
      image: '27.jpg',
      linkedin: 'https://www.linkedin.com/in/arman-anjidani',
      github: '',
      telegram: 'https://t.me/ArmanA05',
    },
    {
      id: 28,
      name: 'کیمیا علوی',
      role: 'عضو تیم اجرایی',
      image: '28.jpg',
      linkedin: '',
      github: '',
      telegram: 'https://t.me/kimiaAlavii',
    },
    {
      id: 29,
      name: 'نوید آتشین‌بار',
      role: 'عضو تیم اجرایی',
      image: '29.jpg',
      linkedin: 'https://www.linkedin.com/in/navid-atashinbar-104667338/',
      github: 'https://github.com/NavidATB',
      telegram: 'https://t.me/navid_atb',
    },
    {
      id: 30,
      name: 'نیلا کشاورز',
      role: 'عضو تیم اجرایی',
      image: '30.jpg',
      linkedin: '',
      github: 'https://github.com/Nila84',
      telegram: 'https://t.me/Nila_kb',
    },
    {
      id: 31,
      name: 'پوریا غفوری',
      role: 'عضو تیم اجرایی',
      image: '31.jpg',
      linkedin: 'https://www.linkedin.com/in/pouria-ghafouri/',
      github: '',
      telegram: '',
    },
    {
      id: 32,
      name: 'امیرحسین شهیدی',
      role: 'عضو تیم اجرایی',
      image: '32.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 33,
      name: 'سیده شقایق میرجلیلی',
      role: 'عضو تیم اجرایی',
      image: '33.jpg',
      linkedin: 'https://www.linkedin.com/in/shaghayegh-mirjalili',
      github: '',
      telegram: 'https://t.me/shaghayeghmir',
    },
    {
      id: 34,
      name: 'نیما قدیرنیا',
      role: 'عضو تیم اجرایی',
      image: '34.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 35,
      name: 'امیرمهدی هدایتی‌پور',
      role: 'عضو تیم اجرایی',
      image: '35.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 39,
      name: 'معین آعلی',
      role: 'عضو تیم اجرایی',
      image: '39.jpg',
      linkedin: 'https://www.linkedin.com/in/moeein',
      github: 'https://github.com/moeeinaali',
      telegram: 'https://t.me/moeein_aali',
    },
    {
      id: 10,
      name: 'محمدحسین اسلامی',
      role: 'عضو تیم اجرایی',
      image: '10.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 47,
      name: 'حسنا شاه‌حیدری',
      role: 'عضو تیم اجرایی',
      image: '47.jpg',
      linkedin: '',
      github: '',
      telegram: 'https://t.me/hosna0sh',
    },
    {
      id: 11,
      name: 'ملیکا علیزاده',
      role: 'مسئول مینی‌گیم',
      image: '11.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
  ],
  'تیم گرافیک و سوشال': [
    {
      id: 36,
      name: 'نرگس کاری',
      role: 'مسئول تیم گرافیک و سوشال',
      image: '36.jpg',
      linkedin: 'https://www.linkedin.com/in/narges-karidolatabadi-a30348291',
      github: 'https://github.com/nargeskari',
      telegram: 'https://t.me/NargesKari',
    },
    {
      id: 37,
      name: 'سیداحمد موسوی‌اول',
      role: 'عضو تیم گرافیک',
      image: '37.jpg',
      linkedin: '',
      github: 'https://github.com/seyedahmadmosaviawal',
      telegram: '',
    },
    {
      id: 38,
      name: 'محمد مصیبی',
      role: 'عضو تیم گرافیک',
      image: '38.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 39,
      name: 'معین آعلی',
      role: 'عضو تیم گرافیک',
      image: '39.jpg',
      linkedin: 'https://www.linkedin.com/in/moeein',
      github: 'https://github.com/moeeinaali',
      telegram: 'https://t.me/moeein_aali',
    },
    {
      id: 41,
      name: 'آرش شاه‌حسینی',
      role: 'عضو تیم گرافیک',
      image: '41.jpg',
      linkedin: '',
      github: '',
      telegram: 'https://t.me/arashahh',
    },
    {
      id: 42,
      name: 'فاطمه نیلفروشان',
      role: 'عضو تیم گرافیک',
      image: '42.jpg',
      linkedin: 'https://www.linkedin.com/in/fatemeh-nilforoushan-903620325/',
      github: '',
      telegram: '',
    },
    {
      id: 24,
      name: 'سارا قضاوی',
      role: 'عضو تیم سوشال',
      image: '24.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 40,
      name: 'سیدمعین حسینی',
      role: 'عضو تیم سوشال',
      image: '40.jpg',
      linkedin: 'https://www.linkedin.com/in/seyyedmoeen-hosseini-5376b738a',
      github: 'https://github.com/MoeenHP',
      telegram: 'https://t.me/MoeenHP',
    },
  ],
  'تیم اسپانسرشیپ': [
    {
      id: 43,
      name: 'امید حیدری',
      role: 'مسئول تیم اسپانسرشیپ',
      image: '43.jpg',
      linkedin: 'https://www.linkedin.com/in/omid-hdr/',
      github: 'https://github.com/omid-hdr',
      telegram: 'https://t.me/omidhdr',
    },
    {
      id: 44,
      name: 'محمدحسن بیاتیانی',
      role: 'عضو تیم اسپانسرشیپ',
      image: '44.jpg',
      linkedin: 'https://www.linkedin.com/in/mowhby',
      github: '',
      telegram: '',
    },
    {
      id: 45,
      name: 'آروین بقال‌اصل',
      role: 'عضو تیم اسپانسرشیپ',
      image: '45.jpg',
      linkedin: '',
      github: 'https://github.com/arvinasli',
      telegram: '',
    },
    {
      id: 46,
      name: 'خورشید باهوش',
      role: 'عضو تیم اسپانسرشیپ',
      image: '46.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 47,
      name: 'حسنا شاه‌حیدری',
      role: 'عضو تیم اسپانسرشیپ',
      image: '47.jpg',
      linkedin: '',
      github: '',
      telegram: 'https://t.me/hosna0sh',
    },
    {
      id: 50,
      name: 'صهیب صادقی',
      role: 'عضو تیم اسپانسرشیپ',
      image: '50.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
  ],
  'تیم مارکتینگ': [
    {
      id: 48,
      name: 'سعید فراتی کاشانی',
      role: 'مسئول تیم مارکتینگ',
      image: '48.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 17,
      name: 'محمدامین کوهی',
      role: 'عضو تیم مارکتینگ',
      image: '17.jpg',
      linkedin: '',
      github: 'https://github.com/orgs/Bugs-Buzzy/people/MohammadAminKoohi',
      telegram: 'https://t.me/ma_koohi',
    },
    {
      id: 49,
      name: 'محمدارمیا قاصری',
      role: 'عضو تیم مارکتینگ',
      image: '49.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 50,
      name: 'صهیب صادقی',
      role: 'عضو تیم مارکتینگ',
      image: '50.jpg',
      linkedin: '',
      github: '',
      telegram: '',
    },
    {
      id: 51,
      name: 'امیرمحمد شربتی',
      role: 'عضو تیم مارکتینگ',
      image: '51.jpg',
      linkedin: 'https://www.linkedin.com/in/amir-mohammad-sharbati-0b8bb4388/',
      github: 'https://github.com/AmirMohammad-Sharbati',
      telegram: 'https://t.me/AMSHN1',
    },
  ],
} as const;

type TeamName = keyof typeof teams;

const TeamFloor = forwardRef<HTMLElement>((props, ref) => {
  const teamNames = Object.keys(teams) as TeamName[];
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [animDirection, setAnimDirection] = useState<'left' | 'right'>('left');
  const [hasScroll, setHasScroll] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const currentTeamName = teamNames[currentTeamIndex];
  const currentMembers = teams[currentTeamName];

  const nextTeam = useCallback(() => {
    setAnimDirection('right');
    setCurrentTeamIndex((prev) => (prev + 1) % teamNames.length);
  }, [teamNames.length]);

  const prevTeam = useCallback(() => {
    setAnimDirection('left');
    setCurrentTeamIndex((prev) => (prev === 0 ? teamNames.length - 1 : prev - 1));
  }, [teamNames.length]);

  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    let lastHorizontalScroll = 0;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastHorizontalScroll > 500) {
          lastHorizontalScroll = now;
          if (e.deltaX > 0) {
            nextTeam();
          } else if (e.deltaX < 0) {
            prevTeam();
          }
        }
        return;
      }

      if (!atTop && e.deltaY < 0) {
        e.stopPropagation();
      } else if (!atBottom && e.deltaY > 0) {
        e.stopPropagation();
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
        e.preventDefault();
        if (diffX > 0) {
          nextTeam();
        } else {
          prevTeam();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextTeam();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        prevTeam();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextTeam, prevTeam]);

  useEffect(() => {
    const checkScroll = () => {
      const container = listContainerRef.current;
      if (!container) return;
      setHasScroll(container.scrollHeight > container.clientHeight);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [currentTeamIndex, currentMembers]);

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgStaff})` }}
    >
      <div className="flex flex-col items-center justify-center h-full px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-8">تیم برگزاری</h1>

        {/* کنترل انتخاب تیم */}
        <div className="flex items-center justify-center gap-6 mb-8 text-white font-pixel">
          <button
            onClick={nextTeam}
            className="p-3 rounded-full bg-gray-900 hover:bg-gray-700 transition"
            aria-label="بعدی"
          >
            <FaChevronRight className="text-2xl" />
          </button>

          <div className="relative min-w-[200px] md:min-w-[300px] h-10">
            <h2
              key={currentTeamIndex}
              className="flex items-center justify-center text-2xl md:text-4xl font-bold text-white font-pixel animate-simple-fade-in"
            >
              {currentTeamName}
            </h2>
          </div>

          <button
            onClick={prevTeam}
            className="p-3 rounded-full bg-gray-900 hover:bg-gray-700 transition"
            aria-label="قبلی"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
        </div>

        <div className="relative w-full max-w-6xl">
          {/* Fade gradient top */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-10 rounded-t-2xl" />

          {/* Fade gradient bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-10 rounded-b-2xl" />

          <div
            ref={listContainerRef}
            className="w-full overflow-y-auto team-scrollbar bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl shadow-2xl"
            style={{ maxHeight: '60vh' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div
              key={currentTeamIndex}
              className={`flex flex-wrap justify-center gap-4 md:gap-6 p-6 animate-team-change-${animDirection}`}
            >
              {currentMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          {hasScroll && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-20">
              <div className="text-white/60 text-xs font-normal animate-bounce bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-1">
                <span>پیمایش کنید</span>
                <span className="text-base">⬍</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-white font-normal text-xs md:text-sm mt-4 opacity-75">
          → اسکرول افقی برای تغییر تیم ←
        </p>
      </div>
    </section>
  );
});

TeamFloor.displayName = 'TeamFloor';

export default TeamFloor;
