import React, { useState } from 'react';

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      // TODO: wire backend endpoint
      setSubmitted(true);
    }
  }

  if (submitted) {
    return <p className="text-secondary-orangeCrayola mt-4">Thank you! We'll keep you updated.</p>;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-4"
      aria-label="newsletter form"
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-3 rounded-md bg-primary-midnight/70 border border-primary-cerulean focus:outline-none focus:ring-2 focus:ring-primary-process text-primary-columbia placeholder:text-primary-sky"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="bg-secondary-golden hover:bg-secondary-orangePantone text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 shadow-lg shadow-primary-midnight/40"
      >
        Notify Me
      </button>
    </form>
  );
}
