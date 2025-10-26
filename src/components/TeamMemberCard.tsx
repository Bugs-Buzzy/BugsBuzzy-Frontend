import { useState } from 'react';
import { FaUserTie, FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';

import PixelFrame from '@/components/PixelFrame';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
  github?: string;
  telegram?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [imgError, setImgError] = useState(false);

  const getImagePath = () => {
    if (!member.image) return null;
    try {
      return new URL(`/src/assets/images/team/${member.image}`, import.meta.url).href;
    } catch {
      return null;
    }
  };

  const imagePath = getImagePath();

  const hasSocials = member.linkedin || member.github || member.telegram;

  return (
    <PixelFrame className="bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 hover:scale-105 transition-all duration-300 w-full md:w-48 shadow-xl">
      <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0 p-3">
        {!imagePath || imgError ? (
          <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 md:mb-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 shadow-inner">
            <FaUserTie className="text-3xl md:text-5xl text-gray-400" />
          </div>
        ) : (
          <img
            src={imagePath}
            alt={member.name}
            className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 md:mb-3 rounded-full object-cover border-2 border-gray-600 shadow-lg"
            style={{ imageRendering: 'auto' }}
            loading="eager"
            decoding="async"
            onError={() => setImgError(true)}
          />
        )}
        <div className="flex flex-col flex-1 md:items-center">
          <h3 className="text-sm md:text-lg font-bold text-white mb-1 font-pixel text-right md:text-center leading-tight">
            {member.name}
          </h3>
          {member.role && (
            <p className="text-gray-400 text-xs md:text-sm font-normal text-right md:text-center mb-2">
              {member.role}
            </p>
          )}
          {hasSocials && (
            <div className="flex gap-2 md:gap-3 mt-1 md:mt-2">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-lg md:text-xl" />
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-lg md:text-xl" />
                </a>
              )}
              {member.telegram && (
                <a
                  href={member.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  aria-label="Telegram"
                >
                  <FaTelegram className="text-lg md:text-xl" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </PixelFrame>
  );
}
