import { forwardRef } from 'react';
import { FaUser, FaUserTie, FaPalette, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

import bgStaff from '@/assets/bkg-staff.png';
import PixelFrame from '@/components/PixelFrame';

const TeamFloor = forwardRef<HTMLElement>((props, ref) => {
  const team = [
    { id: 1, name: 'عضو تیم 1', role: 'مدیر پروژه', avatar: FaUserTie },
    { id: 2, name: 'عضو تیم 2', role: 'توسعه‌دهنده', avatar: FaUser },
    { id: 3, name: 'عضو تیم 3', role: 'طراح', avatar: FaPalette },
    { id: 4, name: 'عضو تیم 4', role: 'محتوا', avatar: FaChalkboardTeacher },
  ];

  return (
    <section
      ref={ref}
      className="floor bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgStaff})` }}
    >
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-pixel mb-8 md:mb-12 flex items-center justify-center gap-4">
            <FaUsers className="text-3xl md:text-5xl" />
            تیم اجرایی
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {team.map((member) => (
              <PixelFrame
                key={member.id}
                className="bg-gray-800 hover:scale-105 transition-transform"
              >
                <member.avatar className="text-4xl md:text-6xl mb-3 md:mb-4 mx-auto" />
                <h3 className="text-sm md:text-xl font-bold text-white mb-2 font-pixel">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm font-normal">{member.role}</p>
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
