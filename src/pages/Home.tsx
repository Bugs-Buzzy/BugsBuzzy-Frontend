import { Countdown } from '@/components/Countdown';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ParticlesCanvas } from '@/components/ParticlesCanvas';
import { SocialLinks } from '@/components/SocialLinks';

export function Home() {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen text-center relative text-primary-columbia">
      <ParticlesCanvas />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-orbitron font-bold uppercase tracking-widest animate-glow">
          BugsBuzzy
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-primary-nonphoto font-light">
          Something is hatching soon.
        </p>
        <Countdown target="2025-10-04T09:00:00" />
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-secondary-orangeCrayola">
            What is BugsBuzzy?
          </h2>
          <p className="text-primary-sky">
            Get ready for a groundbreaking event where technology, creativity, and innovation
            collide. BugsBuzzy is a unique gathering for developers, designers, and thinkers to
            explore the future, share ideas, and build connections. Stay tuned for an experience you
            won't want to miss.
          </p>
        </div>
        <div className="mt-12 w-full max-w-lg">
          <p className="mb-4">Be the first to know. Join our newsletter for updates.</p>
          <NewsletterForm />
        </div>
        <SocialLinks />
      </div>
    </div>
  );
}

export default Home;
