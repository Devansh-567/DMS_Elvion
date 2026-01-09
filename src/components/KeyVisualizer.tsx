import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeyVisualizerProps {
  isActive: boolean;
  progress: number;
}

export const KeyVisualizer = ({ isActive, progress }: KeyVisualizerProps) => {
  const [bits, setBits] = useState<string[]>([]);
  const [activeBits, setActiveBits] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Generate 256 bits for visualization (representing 4096-bit key compressed)
    const initialBits = Array.from({ length: 256 }, () => 
      Math.random() > 0.5 ? '1' : '0'
    );
    setBits(initialBits);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setActiveBits(new Set());
      return;
    }

    const interval = setInterval(() => {
      setBits(prev => prev.map((bit, i) => {
        if (Math.random() > 0.95) {
          return bit === '1' ? '0' : '1';
        }
        return bit;
      }));

      // Highlight random bits
      const newActive = new Set<number>();
      const count = Math.floor(Math.random() * 20) + 10;
      for (let i = 0; i < count; i++) {
        newActive.add(Math.floor(Math.random() * 256));
      }
      setActiveBits(newActive);
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-neon-cyan animate-pulse' : 'bg-muted'}`} />
        <h3 className="font-display text-sm text-primary uppercase tracking-wider">
          4096-Bit Key Matrix
        </h3>
      </div>

      <div className="relative p-4 rounded-lg glass-card overflow-hidden">
        {/* Rotating ring effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-48 h-48 border border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-40 h-40 border border-secondary/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-32 h-32 border border-accent/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Bit grid */}
        <div className="relative grid grid-cols-16 gap-[2px] font-mono text-[8px] z-10">
          {bits.map((bit, i) => (
            <motion.span
              key={i}
              className={`
                w-3 h-3 flex items-center justify-center rounded-sm transition-all duration-75
                ${activeBits.has(i) 
                  ? 'bg-primary/40 text-primary shadow-[0_0_8px_rgba(0,255,255,0.6)]' 
                  : bit === '1' 
                    ? 'bg-primary/10 text-primary/60' 
                    : 'bg-muted/30 text-muted-foreground/40'
                }
              `}
              animate={activeBits.has(i) ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.1 }}
            >
              {bit}
            </motion.span>
          ))}
        </div>

        {/* Key strength indicator */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Key Strength</span>
            <span className="text-primary font-display">4096-BIT AES-256</span>
          </div>
          <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
              initial={{ width: 0 }}
              animate={{ width: isActive ? `${progress}%` : '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
