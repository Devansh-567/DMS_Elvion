import { motion } from 'framer-motion';
import { Timer, Zap, Shield, Database, Activity, Lock } from 'lucide-react';

interface StatsPanelProps {
  inputSize: number;
  outputSize: number;
  processingTime: number | null;
  isProcessing: boolean;
  progress: number;
}

export const StatsPanel = ({ inputSize, outputSize, processingTime, isProcessing, progress }: StatsPanelProps) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = [
    {
      icon: <Database className="w-4 h-4" />,
      label: 'Input Size',
      value: formatBytes(inputSize),
      color: 'text-primary',
    },
    {
      icon: <Lock className="w-4 h-4" />,
      label: 'Output Size',
      value: formatBytes(outputSize),
      color: 'text-secondary',
    },
    {
      icon: <Timer className="w-4 h-4" />,
      label: 'Process Time',
      value: processingTime ? `${processingTime.toFixed(4)}s` : '--',
      color: 'text-accent',
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Security Level',
      value: 'MILITARY',
      color: 'text-neon-green',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className={`w-4 h-4 ${isProcessing ? 'text-neon-green animate-pulse' : 'text-muted-foreground'}`} />
        <h3 className="font-display text-sm text-primary uppercase tracking-wider">
          Real-Time Stats
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-card p-3 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <div className={`font-display text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      
      {/* Algorithm Details */}
      <div className="glass-card p-4 rounded-lg space-y-2">
        <h4 className="font-display text-xs text-primary uppercase tracking-wider mb-3">
          Algorithm Specs
        </h4>
        {[
          { label: 'Cipher', value: 'AES-256-CBC' },
          { label: 'Key Derivation', value: 'PBKDF2-SHA256' },
          { label: 'Iterations', value: '100,000' },
          { label: 'Key Size', value: '4096 bits' },
        ].map((spec) => (
          <div key={spec.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{spec.label}</span>
            <span className="font-mono text-primary">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
