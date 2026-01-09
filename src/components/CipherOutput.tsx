import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CipherOutputProps {
  output: string;
  isAnimating: boolean;
}

export const CipherOutput = ({ output, isAnimating }: CipherOutputProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!output || !isAnimating) {
      setDisplayedText(output);
      return;
    }

    // Animate text appearing character by character
    let index = 0;
    const chars = output.split('');
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < chars.length) {
        setDisplayedText(prev => prev + chars[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [output, isAnimating]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Ciphertext copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted_${Date.now()}.dms4096`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const truncatedText = output.length > 500 && !showFull 
    ? output.slice(0, 500) + '...' 
    : output;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm text-primary uppercase tracking-wider">
          Encrypted Output
        </h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowFull(!showFull)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
            disabled={output.length <= 500}
          >
            {showFull ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showFull ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      <div className="relative glass-card rounded-lg overflow-hidden">
        {/* Scanning line effect when animating */}
        {isAnimating && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent z-10"
            animate={{ y: [0, 200, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="p-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <pre className="font-mono text-xs text-foreground/80 break-all whitespace-pre-wrap">
            {displayedText || (
              <span className="text-muted-foreground italic">
                Awaiting encryption...
              </span>
            )}
            {isAnimating && (
              <motion.span
                className="inline-block w-2 h-4 bg-primary ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </pre>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </div>

      {output && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex-1 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
          >
            {copied ? (
              <Check className="w-3 h-3 mr-2" />
            ) : (
              <Copy className="w-3 h-3 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="flex-1 border-secondary/30 text-secondary hover:bg-secondary/10 hover:text-secondary"
          >
            <Download className="w-3 h-3 mr-2" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
};
