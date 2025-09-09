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
    return <p className="text-green-400 mt-4">Thank you! We'll keep you updated.</p>;
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
        className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
      >
        Notify Me
      </button>
    </form>
  );
}
