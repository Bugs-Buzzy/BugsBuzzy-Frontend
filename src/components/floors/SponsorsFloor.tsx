import { forwardRef } from 'react';
import { FaBuilding, FaGem } from 'react-icons/fa';

import bgSponsor from '@/assets/bkg-sponsor.png';
import PixelFrame from '@/components/PixelFrame';

const SponsorsFloor = forwardRef<HTMLElement>((props, ref) => {
  const sponsors = [
    { id: 1, name: 'حامی 1', logo: FaBuilding },
    { id: 2, name: 'حامی 2', logo: FaBuilding },
    { id: 3, name: 'حامی 3', logo: FaBuilding },
  ];

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgSponsor})` }}
    >
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-8 md:mb-12 flex items-center justify-center gap-4">
            <FaGem className="text-3xl md:text-5xl" />
            حامیان
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {sponsors.map((sponsor) => (
              <PixelFrame
                key={sponsor.id}
                className="bg-secondary-golden hover:scale-105 transition-transform"
              >
                <sponsor.logo className="text-6xl md:text-8xl mb-3 md:mb-4 mx-auto" />
                <h3 className="text-xl md:text-2xl font-bold text-white font-pixel">
                  {sponsor.name}
                </h3>
              </PixelFrame>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

SponsorsFloor.displayName = 'SponsorsFloor';

export default SponsorsFloor;
