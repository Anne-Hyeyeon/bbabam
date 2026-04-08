"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; rotation: number;
  rotationSpeed: number; opacity: number;
}

interface ConfettiProps {
  color: "pink" | "blue";
  active: boolean;
}

const PINK_COLORS = ["#FF6B9D", "#FF8FB1", "#FFB3C6", "#FFC8DD", "#FFDEEB"];
const BLUE_COLORS = ["#74B9FF", "#81ECEC", "#A8E6CF", "#6C9BCF", "#B8D4E3"];

export function Confetti({ color, active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = color === "pink" ? PINK_COLORS : BLUE_COLORS;

    for (let i = 0; i < 150; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05;
        p.rotation += p.rotationSpeed; p.opacity -= 0.003;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);
      if (particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
    animate();
    return () => { cancelAnimationFrame(animationRef.current); particlesRef.current = []; };
  }, [active, color]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}
