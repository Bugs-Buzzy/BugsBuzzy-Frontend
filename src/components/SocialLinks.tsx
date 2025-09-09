import React, { type JSX } from 'react';

const socials: { name: string; href: string; svg: JSX.Element }[] = [
  {
    name: 'Telegram',
    href: 'https://t.me/bugsbuzzy',
    svg: (
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="img"
      >
        <path d="M9.751 14.743l-.396 5.572c.566 0 .81-.243 1.103-.535l2.64-2.528 5.472 3.99c1.002.552 1.715.262 1.98-.923l3.593-16.87h.001c.318-1.488-.54-2.07-1.514-1.71L1.18 10.37c-1.452.564-1.43 1.374-.262 1.742l5.687 1.772L19.57 5.27c.603-.367 1.155-.164.703.203" />
      </svg>
    ),
  },
];

export function SocialLinks() {
  return (
    <div className="flex justify-center mt-10" aria-label="social links">
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          aria-label={s.name}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-nonphoto hover:text-secondary-orangeCrayola transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-orangeCrayola rounded"
        >
          {s.svg}
        </a>
      ))}
    </div>
  );
}
