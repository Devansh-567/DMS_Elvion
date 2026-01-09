import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Image, FileText, Film, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onEncrypt: () => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-8 h-8" />;
  if (type.startsWith('video/')) return <Film className="w-8 h-8" />;
  if (type.includes('pdf') || type.includes('document')) return <FileText className="w-8 h-8" />;
  return <File className="w-8 h-8" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUploadZone = ({ onFileSelect, onEncrypt, selectedFile, isProcessing }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    onFileSelect(null as unknown as File);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
              ${isDragging 
                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,255,255,0.3)]' 
                : 'border-muted/50 hover:border-primary/50 hover:bg-primary/5'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept=".txt,.pdf,.docx,.doc,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
            />

            <div className="flex flex-col items-center text-center">
              <motion.div
                className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-primary/20' : 'bg-muted/30'}`}
                animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              </motion.div>

              <h4 className="font-display text-lg text-foreground mb-2">
                {isDragging ? 'Drop file here' : 'Drag & Drop File'}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {['.txt', '.pdf', '.docx', '.jpg', '.png', '.mp4'].map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-1 text-[10px] font-mono rounded bg-muted/30 text-muted-foreground"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            {/* Animated border */}
            {isDragging && (
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                {getFileIcon(selectedFile.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-display text-foreground truncate">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Button
              className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-display"
              onClick={onEncrypt}
              disabled={isProcessing}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isProcessing ? 'Encrypting...' : 'Encrypt File'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
