import { forwardRef, useRef } from 'react';

import bgQnA from '@/assets/bkg-qna.png';
import PixelFrame from '@/components/PixelFrame';
import qnaData from '@/data/qna-data.json';
import { useScrollInterceptor } from '@/hooks/useScrollInterceptor';

const QnAFloor = forwardRef<HTMLElement>((props, ref) => {
  const questionsRef = useRef<HTMLDivElement>(null);
  useScrollInterceptor(questionsRef, {});

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat py-3 md:py-6"
      style={{ backgroundImage: `url(${bgQnA})` }}
    >
      <div className="flex flex-col items-center justify-center px-4 text-center max-w-6xl mx-auto">
        {/* عنوان اصلی */}
        <h2 className="text-4xl md:text-6xl font-bold text-white font-pixel mb-12 flex items-center justify-center gap-2">
          سوالات متداول
        </h2>

        {/* قاب QnA */}
        <PixelFrame className="bg-secondary-orangePantone bg-opacity-30 p-6 md:px-8 md:py-6 flex flex-col items-center gap-3 transition-transform w-full md:w-4/5">
          {/* متن معرفی */}
          <div className="text-white text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">پاسخ به سوالات شما</h3>
            <p className="text-lg md:text-xl opacity-90">
              در این بخش به متداول‌ترین سوالات شما عزیزان پاسخ داده شده است
            </p>
          </div>

          {/* لیست سوالات و پاسخ‌ها */}
          <div
            className="text-white text-base md:text-lg space-y-6 max-h-[48vh] overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            ref={questionsRef}
          >
            {qnaData.map((item, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary-golden rounded-full flex items-center justify-center mt-1">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl md:text-2xl font-bold text-secondary-orangeCrayola mb-3">
                      {item.question}
                    </h4>
                    <p className="text-white leading-relaxed opacity-90 text-justify">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PixelFrame>
      </div>
    </section>
  );
});

QnAFloor.displayName = 'QnAFloor';

export default QnAFloor;
