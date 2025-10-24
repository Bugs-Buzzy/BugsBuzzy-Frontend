import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { FaChalkboardTeacher, FaCogs, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import bgWorkshops from '@/assets/bkg-workshops.png';
import info1 from '@/assets/images/godot/info1.jpg';
import info2 from '@/assets/images/godot/info2.jpg';
import info3 from '@/assets/images/godot/info3.jpg';
import info4 from '@/assets/images/godot/info4.jpg';
import info5 from '@/assets/images/godot/info5.jpg';
import info6 from '@/assets/images/godot/info6.jpg';
import info7 from '@/assets/images/godot/info7.jpg';
import info8 from '@/assets/images/godot/info8.jpg';
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

  // اسکرول نرم برای دکمه‌های فلش
  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const scrollAmount = ref.current.clientWidth * 0.8;
    ref.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!selectedCategory) return;
    const container =
      selectedCategory === 'presentations' ? horizontalPresRef.current : horizontalGodotRef.current;
    if (!container) return;

    // Scroll با چرخ موس (دسکتاپ)
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        container.scrollLeft += e.deltaY;
      }
    };

    // لمس برای موبایل (اندروید/iOS)
    let isTouching = false;
    let startX = 0;
    let scrollLeftStart = 0;

    const onTouchStart = (e: TouchEvent) => {
      isTouching = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeftStart = container.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = startX - x;
      container.scrollLeft = scrollLeftStart + walk;
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [selectedCategory]);

  const godotWorkshops = [
    { title: 'قسمت 1: نصب و راه‌اندازی Godot', img: info1, date: '۳ آبان' },
    { title: 'قسمت 2: طراحی کاراکتر اصلی', img: info2, date: '۳ آبان' },
    { title: 'قسمت 3: حرکت دوربین', img: info3, date: '۳ آبان' },
    { title: 'قسمت 4: طراحی محیط بازی', img: info4, date: '۴ آبان' },
    { title: 'قسمت 5: پیاده‌سازی منطق بازی', img: info5, date: '۴ آبان' },
    { title: 'قسمت 6: پیاده‌سازی شبکه ۱', img: info6, date: '۴ آبان' },
    { title: 'قسمت 7: پیاده‌سازی شبکه ۲', img: info7, date: '۵ آبان' },
    { title: 'قسمت 8: منو و صداگذاری', img: info8, date: '۵ آبان' },
  ];

  const presentations = [
    { img: img1 },
    { img: img2 },
    { img: img3 },
    { img: img4 },
    { img: img5 },
    { img: img6 },
    { img: img7 },
    { img: img8 },
    { img: img9 },
    { img: img10 },
    { img: img11 },
    { img: img21 },
  ];

  return (
    <>
      {/* صفحه اصلی */}
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
            کارگاه و ارائه‌های آموزشی باگزبازی با هدف ارتقای مهارت‌های شرکت‌کنندگان در حوزه‌های فنی
            و خلاق طراحی شده‌اند.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            <PixelFrame
              className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center p-6 h-44 md:h-56"
              onClick={() => setSelectedCategory('godot')}
            >
              <FaCogs className="text-4xl md:text-5xl mb-2 text-primary-columbia" />
              <h3 className="text-xl md:text-3xl font-bold text-white font-pixel">
                سری کارگاه‌های Godot
              </h3>
            </PixelFrame>

            <PixelFrame
              className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center p-6 h-44 md:h-56"
              onClick={() => setSelectedCategory('presentations')}
            >
              <FaChalkboardTeacher className="text-4xl md:text-5xl mb-2 text-primary-columbia" />
              <h3 className="text-xl md:text-3xl font-bold text-white font-pixel">ارائه‌ها</h3>
            </PixelFrame>
          </div>
        </div>
      </section>

      {/* Godot Workshops Modal */}
      {selectedCategory === 'godot' && (
        <PixelModal onClose={() => setSelectedCategory(null)}>
          <div className="relative text-white font-pixel text-center">
            <h3 className="text-2xl md:text-3xl mb-6 font-bold">سری کارگاه‌های Godot</h3>

            <div
              className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 py-2 scrollable-x items-stretch"
              ref={horizontalGodotRef}
            >
              {godotWorkshops.map((w, i) => (
                <PixelFrame
                  key={i}
                  className="bg-primary-midnight flex flex-col justify-center items-center text-center flex-shrink-0 w-[65vw] sm:w-[18vw] aspect-square cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(w.img)}
                >
                  <div className="flex flex-col justify-center items-center h-full px-2">
                    <h4 className="text-base sm:text-lg font-bold mb-2 leading-snug break-words">
                      {w.title}
                    </h4>
                    <p className="text-primary-columbia text-sm">{w.date}</p>
                  </div>
                </PixelFrame>
              ))}
            </div>
          </div>
        </PixelModal>
      )}

      {/* مودال ارائه‌ها */}
      {selectedCategory === 'presentations' && (
        <PixelModal onClose={() => setSelectedCategory(null)}>
          <div className="relative text-white font-pixel text-center">
            <h3 className="text-3xl mb-6 font-bold">ارائه‌ها</h3>

            {/* فلش‌ها */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 p-3 rounded-full z-10"
              onClick={() => scrollContainer(horizontalPresRef, 'left')}
            >
              <FaChevronLeft />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 p-3 rounded-full z-10"
              onClick={() => scrollContainer(horizontalPresRef, 'right')}
            >
              <FaChevronRight />
            </button>

            <div
              ref={horizontalPresRef}
              className="flex gap-6 overflow-x-auto px-8 py-2 scroll-smooth"
              style={{
                scrollSnapType: 'x mandatory',
                scrollPadding: '0 10%',
              }}
            >
              {presentations.map((p, i) => (
                <div
                  key={i}
                  className="min-w-[220px] md:min-w-[340px] flex-shrink-0 scroll-snap-center"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <img
                    src={p.img}
                    alt={`ارائه ${i + 1}`}
                    className="rounded-2xl w-56 md:w-96 h-56 md:h-96 object-cover mb-2 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(p.img)}
                  />
                </div>
              ))}
            </div>
          </div>
        </PixelModal>
      )}

      {/* نمایش تصویر بزرگ */}
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
