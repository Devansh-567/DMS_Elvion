import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Shuffle, Key, Binary, Shield, Cpu } from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const stages: PipelineStage[] = [
  { id: 'input', name: 'INPUT', description: 'Raw data buffer', icon: <Binary className="w-4 h-4" />, color: 'text-primary' },
  { id: 'aes', name: 'AES-256', description: 'Block cipher init', icon: <Lock className="w-4 h-4" />, color: 'text-primary' },
  { id: 'cbc', name: 'CBC', description: 'Chain block cipher', icon: <Shuffle className="w-4 h-4" />, color: 'text-secondary' },
  { id: 'xor', name: 'XOR', description: 'Bitwise transform', icon: <Cpu className="w-4 h-4" />, color: 'text-secondary' },
  { id: 'key', name: '4096-KEY', description: 'Key derivation', icon: <Key className="w-4 h-4" />, color: 'text-accent' },
  { id: 'output', name: 'OUTPUT', description: 'Encrypted data', icon: <Shield className="w-4 h-4" />, color: 'text-accent' },
];

interface EncryptionPipelineProps {
  activeStage: number;
  isProcessing: boolean;
}

export const EncryptionPipeline = ({ activeStage, isProcessing }: EncryptionPipelineProps) => {
  return (
    <div className="relative py-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-neon-green animate-pulse' : 'bg-muted'}`} />
        <h3 className="font-display text-sm text-primary uppercase tracking-wider">
          Encryption Pipeline
        </h3>
      </div>

      <div className="relative glass-card p-4 rounded-lg overflow-hidden">
        {/* Data flow animation line */}
        {isProcessing && (
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <div className="flex items-center justify-between gap-2">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <motion.div
                className={`
                  relative flex flex-col items-center p-3 rounded-lg border transition-all duration-300
                  ${index <= activeStage && isProcessing
                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                    : 'border-muted/30 bg-muted/5'
                  }
                `}
                animate={index === activeStage && isProcessing ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {/* Active glow effect */}
                {index === activeStage && isProcessing && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/20"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}

                <div className={`${stage.color} mb-1 relative z-10`}>
                  {stage.icon}
                </div>
                <span className={`font-display text-[10px] font-bold ${stage.color} relative z-10`}>
                  {stage.name}
                </span>
                <span className="text-[8px] text-muted-foreground mt-0.5 relative z-10">
                  {stage.description}
                </span>

                {/* Processing indicator */}
                {index === activeStage && isProcessing && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-green"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {index < stages.length - 1 && (
                <motion.div
                  className="mx-1"
                  animate={index < activeStage && isProcessing ? { x: [0, 3, 0] } : {}}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <ArrowRight className={`w-3 h-3 ${
                    index < activeStage && isProcessing ? 'text-primary' : 'text-muted/40'
                  }`} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
