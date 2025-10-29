import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function Countdown({ target }: { target: string | Date }) {
  const targetTime = typeof target === 'string' ? new Date(target).getTime() : target.getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcDiff());
  const [ended, setEnded] = useState(false);

  function calcDiff(): TimeLeft {
    const now = Date.now();
    const distance = targetTime - now;
    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const id = setInterval(() => {
      const diff = calcDiff();
      setTimeLeft(diff);
      if (!ended && Object.values(diff).every((v) => v === 0)) {
        setEnded(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime, ended]);

  if (ended) {
    return (
      <div className="text-xl font-orbitron tracking-[0.25em] uppercase text-primary-columbia">
        شمارش معکوس به پایان رسید!
      </div>
    );
  }

  const boxes: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-5 my-8 md:my-10" dir="ltr">
      {boxes.map((b) => (
        <div
          key={b.label}
          className="flex flex-col items-center justify-center bg-primary-midnight/70 border border-primary-cerulean/40 rounded-xl w-14 p-2 backdrop-blur-sm shadow-md shadow-primary-midnight/30 md:w-20 md:p-3"
        >
          <div className="tabular-nums leading-none font-orbitron text-lg md:text-3xl lg:text-4xl h-8 md:h-12 flex items-center justify-center text-primary-columbia">
            {pad(b.value)}
          </div>
          <div className="text-[9px] tracking-[0.3em] uppercase text-primary-sky/80 mt-1 md:text-xs">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
