import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  char: string;
}

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const particles: Particle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 14 + 10,
        opacity: Math.random() * 0.5 + 0.1,
        char: chars[Math.floor(Math.random() * chars.length)],
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 12, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width;
        }

        // Randomly change character
        if (Math.random() > 0.98) {
          p.char = chars[Math.floor(Math.random() * chars.length)];
        }

        const gradient = ctx.createLinearGradient(p.x, p.y - p.size, p.x, p.y + p.size);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(180, 100, 255, ${p.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 0, 128, ${p.opacity * 0.5})`);

        ctx.font = `${p.size}px "Share Tech Mono", monospace`;
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText(p.char, p.x, p.y);
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(180deg, hsl(220, 20%, 4%) 0%, hsl(240, 25%, 6%) 50%, hsl(220, 20%, 4%) 100%)' }}
    />
  );
};
