import { motion } from 'framer-motion';
import { Shield, Lock, Zap, Binary } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="relative text-center py-12 px-4">
      {/* Animated logo/icon */}
      <motion.div
        className="relative inline-block mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 w-24 h-24 -m-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeDasharray="10 5"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Inner counter-rotating ring */}
        <motion.div
          className="absolute inset-0 w-20 h-20"
          style={{ margin: '2px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="1"
              strokeDasharray="5 10"
              opacity="0.3"
            />
          </svg>
        </motion.div>

        {/* Center icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <Shield className="w-10 h-10 text-primary relative z-10" />
        </div>
      </motion.div>

      {/* Title - Solid, professional look */}
      <motion.h1
        className="font-display text-5xl md:text-7xl font-black mb-4 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-primary">DMS</span>
        <span className="text-secondary">4096</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Military-Grade{' '}
        <span className="text-primary font-semibold">AES-256</span> Encryption
        with{' '}
        <span className="text-secondary font-semibold">4096-bit</span> Key
        Derivation
      </motion.p>

      {/* Feature badges */}
      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[
          { icon: <Lock className="w-3 h-3" />, label: 'AES-256-CBC' },
          { icon: <Binary className="w-3 h-3" />, label: '4096-bit Keys' },
          { icon: <Zap className="w-3 h-3" />, label: 'Instant Processing' },
          { icon: <Shield className="w-3 h-3" />, label: 'Zero Knowledge' },
        ].map((badge, i) => (
          <motion.div
            key={badge.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-primary">{badge.icon}</span>
            <span className="text-foreground/80">{badge.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
