"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface SparkleEffectProps {
  color?: string;
  particleCount?: number;
  continuous?: boolean;
  className?: string;
}

export default function SparkleEffect({
  color = "#FFD700",
  particleCount = 60,
  continuous = false,
  className = "",
}: SparkleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const activeRef = useRef(true);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 215, b: 0 };
  };

  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => {
      const colors = [
        color,
        "#FFFFFF",
        `${color}CC`,
        "#FFF8DC",
      ];
      return {
        x: Math.random() * canvas.width,
        y: continuous ? -10 : Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 3,
        vy: continuous
          ? Math.random() * 2 + 0.5
          : Math.random() * 4 - 1,
        life: 0,
        maxLife: continuous
          ? Math.random() * 120 + 80
          : Math.random() * 80 + 40,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      };
    },
    [color, continuous]
  );

  const drawSparkle = (
    ctx: CanvasRenderingContext2D,
    p: Particle,
    alpha: number
  ) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = alpha;

    const rgb = hexToRgb(p.color);
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;

    // Draw a 4-pointed star
    const s = p.size;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const radius = i % 2 === 0 ? s : s * 0.4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Seed initial particles
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(canvas)
    );

    const animate = () => {
      if (!activeRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        if (!continuous) p.vy += 0.05; // gravity for burst

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1;

        drawSparkle(ctx, p, alpha);
        return p.life < p.maxLife;
      });

      // Replenish
      if (continuous) {
        while (particlesRef.current.length < particleCount) {
          particlesRef.current.push(createParticle(canvas));
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      activeRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, particleCount, continuous, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
