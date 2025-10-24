import { forwardRef, useEffect, useRef, useState } from 'react';
import { FaChalkboardTeacher, FaCogs } from 'react-icons/fa';

import bgWorkshops from '@/assets/bkg-workshops.png';
import img21 from '@/assets/images/presents/coming_soon.jpg';
import img1 from '@/assets/images/presents/img1.jpg';
import img10 from '@/assets/images/presents/img10.jpg';
import img11 from '@/assets/images/presents/img11.jpg';
import img2 from '@/assets/images/presents/img2.jpg';
import img3 from '@/assets/images/presents/img3.jpg';
import img4 from '@/assets/images/presents/img4.jpg';
import img5 from '@/assets/images/presents/img5.jpg';
import img6 from '@/assets/images/presents/img6.jpg';
import img7 from '@/assets/images/presents/img7.jpg';
import img8 from '@/assets/images/presents/img8.jpg';
import img9 from '@/assets/images/presents/img9.jpg';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';

const WorkshopsFloor = forwardRef<HTMLElement>((props, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<'godot' | 'presentations' | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const horizontalPresRef = useRef<HTMLDivElement>(null);
  const horizontalGodotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedCategory) return;
    const container =
      selectedCategory == 'presentations' ? horizontalPresRef.current : horizontalGodotRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    let lastTouchX: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
      lastTouchX = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
      if (lastTouchX === null) return;
      const currentX = e.touches[0].clientX;
      const delta = lastTouchX - currentX;
      container.scrollLeft += delta;
      lastTouchX = currentX;
      e.preventDefault();
    };

    const onTouchEnd = () => {
      lastTouchX = null;
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);
    container.addEventListener('touchcancel', onTouchEnd);

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [selectedCategory]);

  const godotWorkshops = [
    { title: 'قسمت 1: نصب و راه‌اندازی Godot', date: '۲ آبان' },
    { title: 'قسمت 2: طراحی کاراکتر اصلی', date: '۲ آبان' },
    { title: 'قسمت 3: حرکت دوربین', date: '۳ آبان' },
    { title: 'قسمت 4: طراحی محیط بازی', date: '۳ آبان' },
    { title: 'قسمت 5: پیاده‌سازی منطق بازی', date: '۴ آبان' },
    { title: 'قسمت 6: شبکه ۱', date: '۴ آبان' },
    { title: 'قسمت 7: شبکه ۲', date: '۵ آبان' },
    { title: 'قسمت 8: منو و صداگذاری', date: '۵ آبان' },
  ];

  const presentations = [
    { img: img1, date: '۵ آبان - ساعت ۱۸' },
    { img: img2, date: '۶ آبان - ساعت ۱۸' },
    { img: img3, date: '۷ آبان - ساعت ۱۸' },
    { img: img4, date: '۱۰ آبان - ساعت ۱۷:۳۰' },
    { img: img5, date: '۱۰ آبان - ساعت ۱۹' },
    { img: img6, date: '۱۱ آبان - ساعت ۱۷' },
    { img: img7, date: '۱۲ آبان - ساعت ۱۸' },
    { img: img8, date: '۱۳ آبان - ساعت ۱۸' },
    { img: img9, date: '۱۵ آبان - ساعت ۱۷' },
    { img: img10, date: '۱۵ آبان - ساعت ۱۸' },
    { img: img11, date: '۱۶ آبان - ساعت ۱۸' },
    { img: img21, date: 'به‌زودی' },
  ];

  return (
    <>
      <section
        ref={ref}
        className="floor bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgWorkshops})` }}
      >
        <div className="flex flex-col items-center justify-center h-full px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-6">
            ارائه‌ها و کارگاه‌ها
          </h2>
          <p className="text-primary-columbia max-w-3xl mb-10 leading-relaxed">
            کارگاه و ارائه‌های آموزشی باگزبازی با هدف ارتقای دانش و مهارت شرکت‌کنندگان در سطوح مختلف
            طراحی شده‌اند؛ به‌گونه‌ای که هم برای افراد تازه‌کار قابل فهم و کاربردی باشد و هم فرصت
            یادگیری و ارتقای سطح برای شرکت‌کنندگان با تجربه فراهم شود.
          </p>

          {/* گزینه‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            <PixelFrame
              className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center p-4 sm:p-6 h-40 sm:h-48 md:h-56"
              onClick={() => setSelectedCategory('godot')}
            >
              <FaCogs className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-primary-columbia" />
              <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white font-pixel text-center extra-bold">
                سری کارگاه‌های Godot
              </h3>
            </PixelFrame>

            <PixelFrame
              className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center p-4 sm:p-6 h-40 sm:h-48 md:h-56"
              onClick={() => setSelectedCategory('presentations')}
            >
              <FaChalkboardTeacher className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-primary-columbia" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-pixel text-center extra-bold">
                ارائه‌ها
              </h3>
            </PixelFrame>
          </div>
        </div>
      </section>
      {/* Godot Workshops Modal */}
      {selectedCategory === 'godot' && (
        <PixelModal onClose={() => setSelectedCategory(null)}>
          <div className="text-white font-pixel text-center">
            <h3 className="text-2xl md:text-3xl mb-6 font-bold"> سری کارگاه‌های Godot</h3>
            <div
              className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 py-2 scrollable-x"
              ref={horizontalGodotRef}
            >
              {godotWorkshops.map((w, i) => (
                <PixelFrame key={i} className="min-w-[220px] bg-primary-midnight p-4 flex-shrink-0">
                  <h4 className="text-lg font-bold mb-2">{w.title}</h4>
                  <p className="text-primary-columbia text-sm">{w.date}</p>
                </PixelFrame>
              ))}
            </div>
          </div>
        </PixelModal>
      )}
      {/* Modal: Presentations */}
      {selectedCategory === 'presentations' && (
        <PixelModal onClose={() => setSelectedCategory(null)}>
          <div className="text-white font-pixel text-center">
            <h3 className="text-4xl md:text-3xl mb-6 font-bold"> ارائه‌ها</h3>
            <div
              className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 py-2 scrollable-x"
              ref={horizontalPresRef}
            >
              {presentations.map((p, i) => (
                <div key={i} className="min-w-[260px] flex-shrink-0">
                  <img
                    src={p.img}
                    alt={`ارائه ${i + 1}`}
                    className="rounded-2xl w-80 h-80  object-cover mb-2 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(p.img)} // اضافه کردن state جدید
                  />
                  <p className="text-sm text-primary-columbia">{p.date}</p>
                </div>
              ))}
            </div>
          </div>
        </PixelModal>
      )}
      {selectedImage && (
        <PixelModal onClose={() => setSelectedImage(null)}>
          <div className="flex items-center justify-center">
            <img
              src={selectedImage}
              alt="تصویر بزرگ"
              className="max-w-full max-h-[80vh] rounded-3xl"
            />
          </div>
        </PixelModal>
      )}
    </>
  );
});

WorkshopsFloor.displayName = 'WorkshopsFloor';
export default WorkshopsFloor;
