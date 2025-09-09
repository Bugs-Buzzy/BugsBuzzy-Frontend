import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: () => void;
}

export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip entirely in test (jsdom) environment to avoid noisy unimplemented canvas warnings
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      // jsdom environment without canvas implementation; skip animation
      return;
    }
    if (!ctx) return;

    function setCanvasSize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class ParticleImpl implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = 'rgba(255,255,255,0.5)';
      }
      update() {
        if (canvas) {
          if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
          if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        this.x += this.speedX;
        this.y += this.speedY;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesRef.current = [];
      const numberOfParticles =
        ((canvas?.height || window.innerHeight) * (canvas?.width || window.innerWidth)) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push(new ParticleImpl());
      }
    }

    const connectColors = ['#2EB1E0', '#F14F04', '#FB5D13', '#FC7738'];

    function connectParticles() {
      const particles = particlesRef.current;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;
          if (canvas && distance < (canvas.width / 7) * (canvas.height / 7)) {
            const opacity = 1 - distance / 20000;
            if (ctx) {
              const color = connectColors[(a + b) % connectColors.length];
              // Convert hex to rgb
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const bCh = parseInt(color.slice(5, 7), 16);
              ctx.strokeStyle = `rgba(${r},${g},${bCh},${opacity})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }
    }

    function animate() {
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      rafRef.current = requestAnimationFrame(animate);
    }

    function handleResize() {
      setCanvasSize();
      initParticles();
    }

    window.addEventListener('resize', handleResize);
    setCanvasSize();
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
