import { ReactNode, MouseEventHandler } from 'react';

interface PixelFrameProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function PixelFrame({ children, className = '', onClick }: PixelFrameProps) {
  return (
    <div
      className={`relative ${className}`}
      onClick={onClick}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Inner Corner L-shapes (Orange) - روی فریم */}
      {/* Top-left inner L */}
      <div className="absolute -top-1.5 -left-1.5 w-6 h-6 pointer-events-none z-5">
        <div className="absolute bottom-0 right-0 w-6 h-2 bg-[#d48817]" />
        <div className="absolute bottom-0 right-0 w-2 h-6 bg-[#d48817]" />
        <div className="absolute bottom-[2px] right-[2px] w-1 h-1 bg-[#7d5006]" />
      </div>

      {/* Top-right inner L */}
      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 pointer-events-none z-5">
        <div className="absolute bottom-0 left-0 w-6 h-2 bg-[#d48817]" />
        <div className="absolute bottom-0 left-0 w-2 h-6 bg-[#d48817]" />
        <div className="absolute bottom-[2px] left-[2px] w-1 h-1 bg-[#7d5006]" />
      </div>

      {/* Bottom-left inner L */}
      <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 pointer-events-none z-5">
        <div className="absolute top-0 right-0 w-6 h-2 bg-[#d48817]" />
        <div className="absolute top-0 right-0 w-2 h-6 bg-[#d48817]" />
        <div className="absolute top-[2px] right-[2px] w-1 h-1 bg-[#7d5006]" />
      </div>

      {/* Bottom-right inner L */}
      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 pointer-events-none z-5">
        <div className="absolute top-0 left-0 w-6 h-2 bg-[#d48817]" />
        <div className="absolute top-0 left-0 w-2 h-6 bg-[#d48817]" />
        <div className="absolute top-[2px] left-[2px] w-1 h-1 bg-[#7d5006]" />
      </div>

      {/* Main Frame Borders - لایه‌های بوردر */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 border-[3px] border-[#7d5006]" />
        <div className="absolute inset-[6px] border-[5px] border-[#a86b0c]" />
        <div className="absolute inset-[3px] border-[5.5px] border-[#faa61a]" />
      </div>

      {/* Content Area */}
      <div className="relative z-30 flex-1 flex flex-col min-h-0" style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
}
