import { forwardRef, useState } from 'react';
import { FaLaptopCode, FaPalette, FaFlask } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import bgWorkshops from '@/assets/bkg-workshops.png';
import PixelModal from '@/components/modals/PixelModal';
import PixelFrame from '@/components/PixelFrame';
import { useAuth } from '@/context/AuthContext';

const WorkshopsFloor = forwardRef<HTMLElement>((props, ref) => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const workshops = [
    {
      id: 'unity',
      title: 'کارگاه Unity',
      icon: FaLaptopCode,
      description: 'آموزش توسعه بازی با Unity',
      details: 'در این کارگاه با اصول توسعه بازی با Unity آشنا می‌شوید.',
    },
    {
      id: 'pixel-art',
      title: 'کارگاه Pixel Art',
      icon: FaPalette,
      description: 'آموزش طراحی هنر پیکسلی',
      details: 'یاد بگیرید چگونه کاراکترها و محیط‌های پیکسلی بسازید.',
    },
  ];

  const handleRegister = () => {
    if (!user?.is_validated) {
      setShowValidationModal(true);
      return;
    }
  };

  return (
    <>
      <section
        ref={ref}
        className="floor bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgWorkshops})` }}
      >
        <div className="flex items-center justify-center h-full px-4">
          <div className="text-center w-full">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-8 md:mb-12 flex items-center justify-center gap-4">
              <FaFlask className="text-3xl md:text-5xl" />
              کارگاه‌ها
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {workshops.map((workshop) => (
                <PixelFrame
                  key={workshop.id}
                  className="bg-primary-midnight cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedWorkshop(workshop)}
                >
                  <workshop.icon className="text-4xl md:text-6xl mb-3 md:mb-4 mx-auto" />
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 font-pixel">
                    {workshop.title}
                  </h3>
                  <p className="text-primary-columbia font-normal text-sm md:text-base">
                    {workshop.description}
                  </p>
                </PixelFrame>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedWorkshop && (
        <PixelModal onClose={() => setSelectedWorkshop(null)}>
          <div className="text-white font-pixel">
            <selectedWorkshop.icon className="text-4xl md:text-6xl mb-4 mx-auto" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{selectedWorkshop.title}</h3>
            <p className="text-base md:text-lg mb-4 md:mb-6 font-normal">
              {selectedWorkshop.details}
            </p>
            <button
              className="pixel-btn pixel-btn-success py-2 md:py-3 px-4 md:px-6"
              onClick={handleRegister}
            >
              ثبت‌نام در کارگاه
            </button>
          </div>
        </PixelModal>
      )}

      {showValidationModal && (
        <PixelModal onClose={() => setShowValidationModal(false)}>
          <div className="text-white text-center font-pixel">
            <h3 className="text-xl md:text-2xl font-bold mb-4">⚠️</h3>
            <p className="text-base md:text-lg mb-4 md:mb-6 font-normal">
              لطفاً ابتدا از طریق پنل کاربری، پروفایل خود را کامل کنید.
            </p>
            <button
              className="pixel-btn pixel-btn-primary py-2 md:py-3 px-4 md:px-6"
              onClick={() => navigate('/panel/profile')}
            >
              رفتن به پنل
            </button>
          </div>
        </PixelModal>
      )}
    </>
  );
});

WorkshopsFloor.displayName = 'WorkshopsFloor';

export default WorkshopsFloor;
