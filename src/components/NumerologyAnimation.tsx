
"use client";

import { cn } from "@/lib/utils";

const NumerologyAnimation = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const radius = 60; // radius of the circle in pixels

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4 text-accent">
      <div className="relative h-40 w-40">
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 animate-pulse"></div>
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 animate-pulse [animation-delay:-0.5s]"></div>

        {numbers.map((num, i) => {
          // Subtracting Math.PI / 2 to start the circle from the top
          const angle = (i / numbers.length) * 2 * Math.PI - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const animationDelay = `${i * 100}ms`;

          return (
            <div
              key={num}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              <span
                className="font-headline text-lg animate-mystic-pulse"
                style={{ animationDelay }}
              >
                {num}
              </span>
            </div>
          );
        })}
      </div>
      <p className="font-sans text-sm tracking-widest text-muted-foreground animate-pulse [animation-delay:-1s]">Consulting the cosmos...</p>
    </div>
  );
};

export default NumerologyAnimation;
