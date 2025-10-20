import { forwardRef, useState } from 'react';
import { FaChalkboardTeacher, FaCogs } from 'react-icons/fa';

import bgWorkshops from '@/assets/bkg-workshops.png';
import img1 from '@/assets/images/presents/1.jpg';
import img10 from '@/assets/images/presents/10.jpg';
import img2 from '@/assets/images/presents/2.jpg';

// ✅ وارد کردن عکس‌ها
import img3 from '@/assets/images/presents/3.jpg';
import img4 from '@/assets/images/presents/4.jpg';
import img5 from '@/assets/images/presents/5.jpg';
import img6 from '@/assets/images/presents/6.jpg';
import img7 from '@/assets/images/presents/7.jpg';
import img8 from '@/assets/images/presents/8.jpg';
import img9 from '@/assets/images/presents/9.jpg';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';

const WorkshopsFloor = forwardRef<HTMLElement>((props, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<'godot' | 'presentations' | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const godotWorkshops = [
    { title: 'قسمت 1: نصب و راه‌اندازی Godot', date: '۱ آبان' },
    { title: 'قسمت 2: طراحی کاراکتر اصلی', date: '۱ آبان' },
    { title: 'قسمت 3: حرکت دوربین', date: '۲ آبان' },
    { title: 'قسمت 4: طراحی محیط بازی', date: '۲ آبان' },
    { title: 'قسمت 5: پیاده‌سازی منطق بازی', date: '۳ آبان' },
    { title: 'قسمت 6: شبکه ۱', date: '۳ آبان' },
    { title: 'قسمت 7: شبکه ۲', date: '۴ آبان' },
    { title: 'قسمت 8: منو و صداگذاری', date: '۴ آبان' },
  ];

  const presentations = [
    { img: img1, date: '۱ آبان - ساعت ۱۶' },
    { img: img2, date: '۲ آبان - ساعت ۱۶' },
    { img: img3, date: 'به‌زودی' },
    { img: img4, date: 'به‌زودی' },
    { img: img5, date: 'به‌زودی' },
    { img: img6, date: 'به‌زودی' },
    { img: img7, date: 'به‌زودی' },
    { img: img8, date: 'به‌زودی' },
    { img: img9, date: 'به‌زودی' },
    { img: img10, date: 'به‌زودی' },
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
            کارگاه‌ها و ارائه‌های آموزشی رویداد با هدف ارتقای دانش و مهارت شرکت‌کنندگان در سطوح
            مختلف طراحی شده‌اند؛ به‌گونه‌ای که هم برای افراد تازه‌کار قابل فهم و کاربردی باشد و هم
            فرصت یادگیری و ارتقای سطح برای شرکت‌کنندگان با تجربه فراهم شود.
          </p>

          {/* گزینه‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            <PixelFrame
              className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center p-4 sm:p-6 h-40 sm:h-48 md:h-56"
              onClick={() => setSelectedCategory('godot')}
            >
              <FaCogs className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-primary-columbia" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-pixel text-center">
                سری کارگاه‌های Godot
              </h3>
            </PixelFrame>

            <PixelFrame
              className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center p-4 sm:p-6 h-40 sm:h-48 md:h-56"
              onClick={() => setSelectedCategory('presentations')}
            >
              <FaChalkboardTeacher className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-primary-columbia" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-pixel text-center">
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
            <div className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 py-2 scroll-smooth no-scrollbar">
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
            <h3 className="text-2xl md:text-3xl mb-6 font-bold"> ارائه‌ها</h3>
            <div className="flex gap-4 overflow-x-auto whitespace-nowrap px-4 py-2 scroll-smooth no-scrollbar">
              {presentations.map((p, i) => (
                <div key={i} className="min-w-[260px] flex-shrink-0">
                  <img
                    src={p.img}
                    alt={`ارائه ${i + 1}`}
                    className="rounded-2xl w-64 h-64 object-cover mb-2 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(p.img)} // اضافه کردن state جدید
                  />
                  <p className="text-sm text-primary-columbia">{p.date}</p>
                </div>
              ))}
            </div>
          </div>
        </PixelModal>
      )}
      // Modal برای نمایش تصویر بزرگ
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
