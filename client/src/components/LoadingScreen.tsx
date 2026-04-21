import { useState, useEffect } from "react";
import praditaLogo from "@/assets/pradita-logo.png";

export function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const remaining = 100 - prev;
        const increment = Math.max(1, Math.random() * remaining * 0.15);
        return Math.min(100, prev + increment);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const fadeTimer = setTimeout(() => setFadeOut(true), 300);
      const finishTimer = setTimeout(() => onFinish(), 900);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [progress, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mb-8">
        <img
          src={praditaLogo}
          alt="Pradita University"
          className="h-16 w-auto sm:h-20"
        />
      </div>

      <div className="w-56 sm:w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #E30613, #ff4d5a)",
          }}
        />
      </div>

      <p className="mt-3 text-xs text-gray-400 tabular-nums">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
