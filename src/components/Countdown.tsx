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
    return <div className="text-2xl font-orbitron">The Event is Live!</div>;
  }

  const boxes: { label: string; value: number }[] = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-2 sm:gap-4 sm:md:gap-8 my-12" dir="ltr">
      {boxes.map((b) => (
        <div
          key={b.label}
          className="flex flex-col items-center justify-center bg-primary-midnight/60 border border-primary-cerulean/40 rounded-lg w-16 p-2 backdrop-blur-sm shadow-md shadow-primary-midnight/40 sm:w-24 sm:p-3 sm:md:w-28 sm:md:p-4"
        >
          <div className="tabular-nums leading-none font-orbitron text-xl h-8 flex items-center justify-center sm:text-4xl sm:h-14 sm:md:text-6xl sm:md:h-20">
            {pad(b.value)}
          </div>
          <div className="text-[8px] tracking-wider uppercase text-primary-sky mt-2 sm:text-[10px] sm:md:text-xs">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
