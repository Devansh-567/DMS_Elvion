import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, FileText, Upload, Sparkles } from 'lucide-react';


import { HeroSection } from '@/components/HeroSection';
import { EncryptionPipeline } from '@/components/EncryptionPipeline';
import { StatsPanel } from '@/components/StatsPanel';
import { CipherOutput } from '@/components/CipherOutput';
import { FileUploadZone } from '@/components/FileUploadZone';
import { SecurityHeatmap } from '@/components/SecurityHeatmap';
import { encryptText, decryptText, encryptFile, decryptFile, createDownloadableFile, EncryptedFileData } from '@/lib/encryption';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [decryptedFileData, setDecryptedFileData] = useState<EncryptedFileData | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [isAnimatingOutput, setIsAnimatingOutput] = useState(false);
  const { toast } = useToast();

  // Simulate pipeline stages during processing
  useEffect(() => {
    if (!isProcessing) {
      setActiveStage(-1);
      return;
    }

    const stages = 6;
    const stageInterval = 150;
    let currentStage = 0;

    const interval = setInterval(() => {
      currentStage = (currentStage + 1) % (stages + 1);
      setActiveStage(currentStage);
      setProgress((currentStage / stages) * 100);
    }, stageInterval);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleEncrypt = async () => {
    if (!inputText.trim()) {
      toast({ title: 'Error', description: 'Please enter text to encrypt', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    setDecryptedFileData(null);
    setIsAnimatingOutput(true);

    try {
      const start = performance.now();
      const encrypted = await encryptText(inputText);
      const end = performance.now();

      setOutputText(encrypted);
      setProcessingTime((end - start) / 1000);

      toast({
        title: '🔒 Encryption Complete',
        description: `Processed in ${((end - start) / 1000).toFixed(4)}s`,
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Encryption failed', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setIsAnimatingOutput(false), 1000);
    }
  };

  const handleDecrypt = async () => {
    if (!inputText.trim()) {
      toast({ title: 'Error', description: 'Please enter ciphertext to decrypt', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    setIsAnimatingOutput(true);

    try {
      const start = performance.now();

      // Try to decrypt as file first
      try {
        const fileData = await decryptFile(inputText);
        const end = performance.now();
        setDecryptedFileData(fileData);
        setOutputText(`📁 Decrypted file: ${fileData.metadata.name} (${formatBytes(fileData.metadata.size)})`);
        setProcessingTime((end - start) / 1000);
        toast({ title: '🔓 File Decrypted', description: fileData.metadata.name });
      } catch {
        // Decrypt as text
        const decrypted = await decryptText(inputText);
        const end = performance.now();
        setOutputText(decrypted);
        setProcessingTime((end - start) / 1000);
        toast({ title: '🔓 Decryption Complete' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Decryption failed - invalid ciphertext', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setIsAnimatingOutput(false), 1000);
    }
  };

  const handleFileEncrypt = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setIsAnimatingOutput(true);

    try {
      const start = performance.now();
      const encrypted = await encryptFile(selectedFile);
      const end = performance.now();

      setOutputText(encrypted);
      setProcessingTime((end - start) / 1000);

      toast({
        title: '🔒 File Encrypted',
        description: `${selectedFile.name} processed in ${((end - start) / 1000).toFixed(4)}s`,
      });
    } catch (error) {
      toast({ title: 'Error', description: 'File encryption failed', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setIsAnimatingOutput(false), 1000);
    }
  };

  const handleDownloadDecrypted = () => {
    if (!decryptedFileData) return;
    const blob = createDownloadableFile(decryptedFileData);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = decryptedFileData.metadata.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />

      {/* Main content */}
      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Hero Section */}
          <HeroSection />

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - Encryption Interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pipeline Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <EncryptionPipeline activeStage={activeStage} isProcessing={isProcessing} />
              </motion.div>

              {/* Input Panel */}
              <motion.div
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 bg-muted/30 mb-4">
                    <TabsTrigger
                      value="text"
                      className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Text Mode
                    </TabsTrigger>
                    <TabsTrigger
                      value="file"
                      className="font-display data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      File Mode
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Enter text to encrypt or paste ciphertext to decrypt..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[150px] bg-input/50 border-primary/20 text-foreground placeholder:text-muted-foreground font-mono text-sm focus:border-primary/50 focus:ring-primary/20 resize-none"
                      />
                      {inputText && (
                        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground font-mono">
                          {inputText.length} chars • {formatBytes(new Blob([inputText]).size)}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="cyber-encrypt"
                        className="flex-1"
                        onClick={handleEncrypt}
                        disabled={isProcessing}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Encrypt'}
                      </Button>
                      <Button
                        variant="cyber-decrypt"
                        className="flex-1"
                        onClick={handleDecrypt}
                        disabled={isProcessing}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Decrypt'}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="file">
                    <FileUploadZone
                      onFileSelect={setSelectedFile}
                      onEncrypt={handleFileEncrypt}
                      selectedFile={selectedFile}
                      isProcessing={isProcessing}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Output Panel */}
              <motion.div
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CipherOutput output={outputText} isAnimating={isAnimatingOutput} />

                {decryptedFileData && (
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-neon-green to-primary text-primary-foreground font-display"
                    onClick={handleDownloadDecrypted}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Download Decrypted File
                  </Button>
                )}
              </motion.div>
            </div>

            {/* Right Column - Visualizations & Stats */}
            <div className="space-y-6">
              {/* Security Heatmap */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SecurityHeatmap inputText={inputText} isProcessing={isProcessing} />
              </motion.div>

              {/* Stats Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <StatsPanel
                  inputSize={new Blob([inputText]).size}
                  outputSize={new Blob([outputText]).size}
                  processingTime={processingTime}
                  isProcessing={isProcessing}
                  progress={progress}
                />
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div
            className="text-center py-12 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-muted-foreground text-sm font-mono">
              DMS4096 • AES-256-CBC • PBKDF2-SHA256 • 100,000 Iterations
            </p>
            <p className="text-muted-foreground/50 text-xs mt-2">
              © DMS Team 2024–2026. Proprietary technology. All rights reserved.

            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
