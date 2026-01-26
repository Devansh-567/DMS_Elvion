import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SecurityHeatmapProps {
  inputText: string;
  isProcessing: boolean;
}

export const SecurityHeatmap = ({ inputText, isProcessing }: SecurityHeatmapProps) => {
  const [heatmapData, setHeatmapData] = useState<number[]>([]);

  useEffect(() => {
    if (!inputText) {
      setHeatmapData([]);
      return;
    }

    // Generate heatmap based on character entropy
    const chunks = [];
    const chunkSize = Math.ceil(inputText.length / 64);
    
    for (let i = 0; i < 64; i++) {
      const start = i * chunkSize;
      const chunk = inputText.slice(start, start + chunkSize);
      
      // Calculate pseudo-entropy for visual effect
      const uniqueChars = new Set(chunk.split('')).size;
      const entropy = chunk.length > 0 ? (uniqueChars / chunk.length) * 100 : 0;
      chunks.push(Math.min(100, entropy + Math.random() * 30));
    }
    
    setHeatmapData(chunks);
  }, [inputText]);

  const getColor = (value: number) => {
    if (value > 80) return 'bg-neon-green';
    if (value > 60) return 'bg-primary';
    if (value > 40) return 'bg-secondary';
    if (value > 20) return 'bg-accent';
    return 'bg-destructive';
  };

  const getGlow = (value: number) => {
    if (value > 80) return 'shadow-[0_0_8px_hsl(var(--neon-green)/0.6)]';
    if (value > 60) return 'shadow-[0_0_8px_hsl(var(--primary)/0.6)]';
    if (value > 40) return 'shadow-[0_0_8px_hsl(var(--secondary)/0.6)]';
    return '';
  };

  if (!inputText) {
    return (
      <div className="glass-card rounded-lg p-4">
        <h3 className="font-display text-sm text-primary uppercase tracking-wider mb-3">
          System use Heatmap
        </h3>
        <div className="text-center py-8 text-muted-foreground text-sm">
          Enter data to visualize system impact
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm text-primary uppercase tracking-wider">
          System use Heatmap
        </h3>
        <span className="text-[10px] text-muted-foreground">
          {inputText.length} chars analyzed
        </span>
      </div>

      <div className="grid grid-cols-8 gap-1 mb-4">
        {heatmapData.map((value, i) => (
          <motion.div
            key={i}
            className={`aspect-square rounded-sm ${getColor(value)} ${getGlow(value)} transition-all`}
            style={{ opacity: 0.4 + (value / 100) * 0.6 }}
            animate={isProcessing ? { 
              opacity: [0.4 + (value / 100) * 0.6, 1, 0.4 + (value / 100) * 0.6],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ 
              duration: 0.3, 
              delay: i * 0.01,
              repeat: isProcessing ? Infinity : 0 
            }}
          />
        ))}
      </div>

      <div className="flex justify-between text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-destructive" />
          <span className="text-muted-foreground">Rest</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-neon-green" />
          <span className="text-muted-foreground">Usage</span>
        </div>
      </div>
    </div>
  );
};
