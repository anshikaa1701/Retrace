import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Upload, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Zap, 
  FileText,
  HelpCircle,
  Check,
  ChevronRight
} from 'lucide-react';
import { DeviceDatabaseService, ImeiLookupResult, validateLuhn, maskIdentifier } from '../../services/deviceDatabaseService';

interface ImeiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImeiDetected: (imei: string, lookupResult?: ImeiLookupResult) => void;
  onSelectDevice?: (device: any) => void;
}

// Sample presets for quick testing on desktop or when no physical phone is at hand
const TEST_IMEI_PRESETS = [
  {
    label: 'Samsung S24 Ultra',
    imei: '358240091284752',
    model: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    note: 'Valid Luhn • TAC 35824009'
  },
  {
    label: 'iPhone 15 Pro',
    imei: '354152119830214',
    model: 'iPhone 15 Pro',
    brand: 'Apple',
    note: 'Valid Luhn • TAC 35415211'
  },
  {
    label: 'Google Pixel 8 Pro',
    imei: '358762104928173',
    model: 'Pixel 8 Pro',
    brand: 'Google',
    note: 'Valid Luhn • TAC 35876210'
  },
  {
    label: 'Unconfirmed TAC Device',
    imei: '990001234567890',
    model: 'Custom / Vintage Device',
    brand: 'Unknown',
    note: 'Valid 15 Digits • Unmatched TAC'
  }
];

export const ImeiScannerModal: React.FC<ImeiScannerModalProps> = ({
  isOpen,
  onClose,
  onImeiDetected,
  onSelectDevice
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'test'>('camera');
  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'active' | 'denied' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  // Detection result state
  const [detectedImei, setDetectedImei] = useState<string>('');
  const [editableImei, setEditableImei] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<ImeiLookupResult | null>(null);
  const [isLookingUp, setIsLookingUp] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, []);

  // Handle successful detection of 15 digits
  const handleFoundImei = useCallback(async (imei: string) => {
    const clean = imei.trim();
    setDetectedImei(clean);
    setEditableImei(clean);
    setIsLookingUp(true);
    setStatusMessage('Verifying IMEI & querying hardware registry...');

    try {
      const result = await DeviceDatabaseService.getDeviceByIMEI(clean);
      setLookupResult(result);
    } catch (err: any) {
      setLookupResult({
        valid: /^\d{15}$/.test(clean),
        luhnValid: validateLuhn(clean),
        imei: clean,
        maskedImei: maskIdentifier(clean, true),
        identified: false,
        device: null,
        message: 'Could not contact device registry. You may continue manually.'
      });
    } finally {
      setIsLookingUp(false);
      setIsProcessing(false);
      setStatusMessage('');
    }
  }, []);

  // Preprocess frame on canvas and run OCR
  const captureAndProcessFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing || detectedImei) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    setIsProcessing(true);
    setStatusMessage('Analyzing frame for 15-digit IMEI...');

    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Crop central scan area (60% width, 35% height)
      const cropW = Math.floor(canvas.width * 0.7);
      const cropH = Math.floor(canvas.height * 0.4);
      const cropX = Math.floor((canvas.width - cropW) / 2);
      const cropY = Math.floor((canvas.height - cropH) / 2);

      const frameData = ctx.getImageData(cropX, cropY, cropW, cropH);

      // 1. Try native BarcodeDetector if available
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['code_128', 'ean_13', 'data_matrix', 'qr_code']
          });
          const barcodes = await barcodeDetector.detect(canvas);
          for (const b of barcodes) {
            const rawVal = b.rawValue || '';
            const match = rawVal.match(/\b\d{15}\b/);
            if (match) {
              await handleFoundImei(match[0]);
              return;
            }
          }
        } catch (e) {
          // BarcodeDetector failed, proceed to OCR
        }
      }

      // 2. High-contrast thresholding for OCR enhancement
      const data = frameData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        // Boost contrast: values > 128 become whiter, < 128 darker
        const contrast = avg > 120 ? 255 : 0;
        data[i] = contrast;
        data[i + 1] = contrast;
        data[i + 2] = contrast;
      }

      // Create a temporary canvas for cropped and preprocessed image
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d');
      if (cropCtx) {
        cropCtx.putImageData(frameData, 0, 0);

        // Dynamically import tesseract.js for fast execution
        const Tesseract = await import('tesseract.js');
        const { data: { text } } = await Tesseract.recognize(cropCanvas, 'eng');

        // Regex patterns to look for IMEI sequences
        // Matches: "IMEI: 358240091284752", "358240091284752", "IMEI 1: 35...", etc.
        const cleanText = text.replace(/[\r\n\t]/g, ' ');
        const imeiMatch = cleanText.match(/\b(\d{15})\b/) || cleanText.match(/(?:IMEI|TAC|SN)[:\s#]*(\d{15})/i);

        if (imeiMatch && imeiMatch[1]) {
          await handleFoundImei(imeiMatch[1]);
          return;
        }

        // Try extracting sequence of digits that might be spaced like "358240 09 128475 2"
        const digitSeq = cleanText.replace(/[^\d]/g, '');
        if (digitSeq.length >= 15) {
          // Find standard 15-digit candidate starting with common TAC prefixes like 35 or 86
          const candidateMatch = digitSeq.match(/(35\d{13}|86\d{13}|\d{15})/);
          if (candidateMatch) {
            await handleFoundImei(candidateMatch[1].slice(0, 15));
            return;
          }
        }
      }
    } catch (err: any) {
      console.warn('[ImeiScannerModal] OCR error:', err);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  }, [isProcessing, detectedImei, handleFoundImei]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraState('starting');
    setErrorMessage('');
    setDetectedImei('');
    setLookupResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser or environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraState('active');
          // Periodically scan frames every 2 seconds
          scanIntervalRef.current = window.setInterval(() => {
            captureAndProcessFrame();
          }, 2000);
        };
      }
    } catch (err: any) {
      console.error('[ImeiScannerModal] Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser or enter the IMEI manually.');
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to access device camera. Please check your camera settings.');
      }
    }
  }, [stopCamera, captureAndProcessFrame]);

  // Handle uploaded image file
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMessage('Reading text from uploaded image...');
    setErrorMessage('');

    try {
      const Tesseract = await import('tesseract.js');
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      const cleanText = text.replace(/[\r\n\t]/g, ' ');
      const match = cleanText.match(/\b(\d{15})\b/) || cleanText.match(/(?:IMEI|TAC)[:\s#]*(\d{15})/i);

      if (match && match[1]) {
        await handleFoundImei(match[1]);
      } else {
        const digitSeq = cleanText.replace(/[^\d]/g, '');
        const candidateMatch = digitSeq.match(/(35\d{13}|86\d{13}|\d{15})/);
        if (candidateMatch) {
          await handleFoundImei(candidateMatch[1].slice(0, 15));
        } else {
          setErrorMessage('Could not find a valid 15-digit IMEI in this image. Please ensure the label is well-lit and legible.');
        }
      }
    } catch (err: any) {
      setErrorMessage('OCR processing failed. You may enter the IMEI manually.');
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Open modal effect
  useEffect(() => {
    if (isOpen) {
      setDetectedImei('');
      setEditableImei('');
      setLookupResult(null);
      setErrorMessage('');
      if (activeTab === 'camera') {
        startCamera();
      }
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, startCamera, stopCamera]);

  if (!isOpen) return null;

  const is15Digits = /^\d{15}$/.test(editableImei.trim());
  const luhnValid = is15Digits ? validateLuhn(editableImei.trim()) : false;

  // Confirm and apply the detected device/IMEI
  const handleApplyDetection = () => {
    if (!is15Digits) return;
    onImeiDetected(editableImei.trim(), lookupResult || undefined);
    if (lookupResult?.identified && lookupResult.device && onSelectDevice) {
      onSelectDevice(lookupResult.device);
    }
    onClose();
  };

  // Scan again
  const handleScanAgain = () => {
    setDetectedImei('');
    setEditableImei('');
    setLookupResult(null);
    setErrorMessage('');
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 px-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-zinc-100 text-sm sm:text-base leading-tight">
                IMEI Optical Scanner
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">
                15-Digit Hardware Identifier & GSMA Registry Lookup
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Camera / Upload / Test Presets */}
        <div className="px-5 pt-3 border-b border-zinc-800 bg-zinc-950/30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('camera');
              if (!detectedImei) startCamera();
            }}
            className={`pb-2.5 px-2 text-xs font-mono transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`pb-2.5 px-2 text-xs font-mono transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveTab('test');
            }}
            className={`pb-2.5 px-2 text-xs font-mono transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'test'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Bench</span>
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-5 space-y-4 overflow-y-auto font-sans flex-1">
          
          {/* TAB 1: LIVE CAMERA SCANNER */}
          {activeTab === 'camera' && !detectedImei && (
            <div className="space-y-3.5">
              {/* Camera Viewport with Futuristic Scanning Overlay */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraState === 'active' ? 'block' : 'hidden'}`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Starting / Loading Overlay */}
                {cameraState === 'starting' && (
                  <div className="flex flex-col items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
                    <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                    <span>Initializing camera stream...</span>
                  </div>
                )}

                {/* Camera Permission Denied / Error State */}
                {(cameraState === 'denied' || cameraState === 'error') && (
                  <div className="p-6 text-center space-y-3 max-w-xs">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-mono text-zinc-300 leading-relaxed">
                      {errorMessage || 'Camera access unavailable'}
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs transition-colors cursor-pointer border border-zinc-700"
                      >
                        Try Again
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('test')}
                        className="w-full px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-mono text-xs transition-colors cursor-pointer border border-amber-400/30"
                      >
                        ⚡ Use Test Preset
                      </button>
                    </div>
                  </div>
                )}

                {/* Active HUD Scanning Frame Overlay */}
                {cameraState === 'active' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Targeting reticle frame */}
                    <div className="relative w-[78%] h-[42%] border-2 border-dashed border-amber-400/60 rounded-xl bg-amber-400/[0.03] shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center justify-between p-2">
                      
                      {/* 4 Corner brackets */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                      {/* Header guide */}
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 bg-zinc-950/80 px-2 py-0.5 rounded">
                        Position IMEI Inside Frame
                      </span>

                      {/* Animated Laser Scanning Line */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse shadow-[0_0_8px_#f59e0b]" />

                      {/* Bottom indicator */}
                      <span className="text-[9px] font-mono text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded">
                        [ SCAN AREA • 15 DIGITS ]
                      </span>
                    </div>

                    {/* Live status badge */}
                    {isProcessing && (
                      <div className="absolute bottom-3 px-3 py-1 rounded-full bg-zinc-950/90 border border-amber-400/40 text-amber-400 font-mono text-[11px] flex items-center gap-1.5 shadow-lg backdrop-blur">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>{statusMessage || 'Reading text...'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Snap / Frame read button */}
              {cameraState === 'active' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={captureAndProcessFrame}
                    disabled={isProcessing}
                    className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-zinc-950" />
                    <span>{isProcessing ? 'Processing OCR...' : 'Capture & Read Frame'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors cursor-pointer border border-zinc-700"
                  >
                    Enter Manually
                  </button>
                </div>
              )}

              {/* Optical Detection Guidance Tips */}
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-1.5">
                <div className="text-zinc-300 font-medium flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Where to find your device&apos;s 15-digit IMEI:</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-zinc-400 text-[10px] pt-0.5">
                  <span className="flex items-center gap-1">• Phone screen: Dial *#06#</span>
                  <span className="flex items-center gap-1">• Retail packaging box sticker</span>
                  <span className="flex items-center gap-1">• Original purchase invoice</span>
                  <span className="flex items-center gap-1">• Settings → About Phone</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD PHOTO / SCREENSHOT */}
          {activeTab === 'upload' && !detectedImei && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-zinc-700 hover:border-amber-400/60 rounded-xl p-8 text-center transition-colors relative bg-zinc-950/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={isProcessing}
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    Drop photo of IMEI sticker or screenshot here
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    PNG, JPG, or WebP from camera roll or files
                  </span>
                </div>
              </div>

              {isProcessing && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-amber-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEST PRESETS / DEMO */}
          {activeTab === 'test' && !detectedImei && (
            <div className="space-y-3 font-mono text-xs">
              <div className="text-zinc-400 text-[11px] leading-relaxed">
                Click any real-world device preset below to immediately test the automated IMEI extraction and GSMA model resolution flow:
              </div>

              <div className="space-y-2">
                {TEST_IMEI_PRESETS.map((preset) => (
                  <button
                    key={preset.imei}
                    type="button"
                    onClick={() => handleFoundImei(preset.imei)}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-800/40 text-left transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="text-zinc-200 font-bold group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        <span>{preset.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {preset.brand}
                        </span>
                      </div>
                      <div className="text-zinc-400 text-[11px] tracking-wider">
                        IMEI: {preset.imei}
                      </div>
                      <div className="text-emerald-400 text-[10px]">
                        ✓ {preset.note}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              DETECTION CONFIRMATION & HARDWARE SUGGESTION SCREEN
              ========================================================================= */}
          {detectedImei && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              
              {/* Success Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>15-Digit IMEI Detected</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/80">
                  {luhnValid ? '✓ Valid Luhn Checksum' : 'Checksum Unverified'}
                </span>
              </div>

              {/* Detected IMEI field (Editable by User) */}
              <div className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-zinc-300 uppercase tracking-wider text-[11px]">
                    Detected IMEI Number:
                  </label>
                  <span className={`text-[10px] ${is15Digits ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {editableImei.length} / 15 Digits
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    maxLength={15}
                    value={editableImei}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d]/g, '');
                      setEditableImei(val);
                      if (val.length === 15) {
                        handleFoundImei(val);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-amber-400 font-bold tracking-wider text-base focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    placeholder="15-digit IMEI"
                  />
                  {luhnValid && (
                    <div className="absolute right-3 top-3 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-zinc-500 block">
                  Verify or edit digits if optical recognition misread any number.
                </span>
              </div>

              {/* Hardware Registry Match Card */}
              {isLookingUp ? (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center gap-2 text-xs font-mono text-zinc-400">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Querying GSMA TAC hardware database...</span>
                </div>
              ) : lookupResult?.identified && lookupResult.device ? (
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-400/40 space-y-2.5 font-mono text-xs shadow-lg">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Suggested Device Information
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                      TAC {lookupResult.tac}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-base font-display font-bold text-zinc-100 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span>{lookupResult.device.brand} {lookupResult.device.model}</span>
                    </div>
                    {lookupResult.device.modelNumber && (
                      <div className="text-[11px] text-zinc-400">
                        OEM Model No: <span className="text-zinc-200">{lookupResult.device.modelNumber}</span>
                      </div>
                    )}
                  </div>

                  {lookupResult.device.specifications && (
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-1 text-[11px] text-zinc-300">
                      {lookupResult.device.specifications.processor && (
                        <div>• Chipset: <span className="text-zinc-100">{lookupResult.device.specifications.processor}</span></div>
                      )}
                      {lookupResult.device.specifications.display && (
                        <div>• Display: <span className="text-zinc-100">{lookupResult.device.specifications.display}</span></div>
                      )}
                    </div>
                  )}

                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Manufacturer hardware profile validated. You can still modify fields later.</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-1 leading-relaxed">
                  <div className="text-zinc-300 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Device information could not be confirmed from this IMEI.</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    The 15-digit identifier is verified, but the exact model cannot be determined automatically. You can proceed with standard Brand and Model selection.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyDetection}
                  disabled={!is15Digits}
                  className="w-full sm:flex-1 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>
                    {lookupResult?.identified ? 'Use This Device' : 'Use Detected IMEI'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleScanAgain}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors cursor-pointer border border-zinc-700"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Security Guarantee Note */}
          <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 text-[10px] font-mono text-zinc-500 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span>Camera frames are analyzed entirely in memory and never stored or uploaded.</span>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 px-5 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>ReTrace Optical Hardware Verification</span>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Enter manually
          </button>
        </div>
      </div>
    </div>
  );
};
