
"use client";

import { cn } from "@/lib/utils";

const SmokeScreen = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 h-full pointer-events-none transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background via-background/90 to-transparent transition-transform duration-[1500ms] ease-out",
         !isVisible && 'translate-y-full' // Move down when not visible
      )}>
        <div className="relative h-full w-full overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-[-150px] animate-wisp-up"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${200 + Math.random() * 150}px`,
                width: `${200 + Math.random() * 150}px`,
                backgroundColor: 'hsl(var(--accent))',
                opacity: `${0.03 + Math.random() * 0.05}`,
                borderRadius: '50%',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                filter: 'blur(20px)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmokeScreen;
