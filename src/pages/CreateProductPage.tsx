import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { ProductType } from '../types';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Watch, 
  Tv, 
  Layers, 
  Bike, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Printer, 
  Copy, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  Camera,
  Cpu,
  Zap,
  Info,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImeiScannerModal } from '../components/registration/ImeiScannerModal';
import { DeviceModelSelector } from '../components/registration/DeviceModelSelector';
import { 
  DeviceCatalogItem, 
  ImeiLookupResult, 
  validateLuhn, 
  maskIdentifier, 
  computeImeiHashClient 
} from '../services/deviceDatabaseService';

const PRODUCT_TYPE_OPTIONS: { type: ProductType; label: string; icon: any; idLabel: string; placeholder: string; required: boolean }[] = [
  { type: 'Smartphone', label: 'Smartphone', icon: Smartphone, idLabel: 'IMEI Number (15 Digits)', placeholder: 'e.g. 358240091284752', required: true },
  { type: 'Laptop', label: 'Laptop', icon: Laptop, idLabel: 'Serial Number', placeholder: 'e.g. CN-0K752D-72891-49A', required: true },
  { type: 'Tablet', label: 'Tablet', icon: Tablet, idLabel: 'Serial Number', placeholder: 'e.g. DMPX12984M0', required: false },
  { type: 'Smartwatch', label: 'Smartwatch', icon: Watch, idLabel: 'Serial / Model ID', placeholder: 'e.g. SW-8821-X', required: false },
  { type: 'Television', label: 'Television', icon: Tv, idLabel: 'Serial Number', placeholder: 'e.g. LG-OLED-65-9821', required: false },
  { type: 'Refrigerator', label: 'Refrigerator', icon: Layers, idLabel: 'Appliance Serial / Model No.', placeholder: 'e.g. SM-RF-2024-88', required: false },
  { type: 'Washing Machine', label: 'Washing Machine', icon: Layers, idLabel: 'Appliance Serial No.', placeholder: 'e.g. WM-BOSCH-7721', required: false },
  { type: 'Bicycle', label: 'Bicycle', icon: Bike, idLabel: 'Frame Number', placeholder: 'e.g. TRK-FRAME-99120', required: false },
  { type: 'Other', label: 'Other Product', icon: Layers, idLabel: 'Serial / Product Identifier', placeholder: 'e.g. SN-882194', required: false }
];

export const CreateProductPage: React.FC = () => {
  const { createProduct, currentUser, products } = useApp();
  const navigate = useNavigate();

  // Multi-step state: 1 = Product, 2 = Device Identity, 3 = Purchase Info, 4 = Review, 5 = Passport Issued
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [productType, setProductType] = useState<ProductType>('Smartphone');
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('Galaxy S24 Ultra');
  const [modelNumber, setModelNumber] = useState('SM-S928B/DS');
  const [purchaseDate, setPurchaseDate] = useState('2026-08-12');
  const [serialNumber, setSerialNumber] = useState('358240091284752');
  const [invoiceFileName, setInvoiceFileName] = useState('Samsung_Official_Invoice_2026.pdf');
  const [invoiceFileSize, setInvoiceFileSize] = useState('1.4 MB');
  const [isInvoiceUploaded, setIsInvoiceUploaded] = useState(true);

  // Selected Catalog Item Specifications
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<DeviceCatalogItem | null>(null);
  const [specs, setSpecs] = useState<any>({
    processor: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
    ram: '12GB LPDDR5X',
    storage: '512GB UFS 4.0',
    batteryHealth: '5000 mAh (100% OEM)',
    display: '6.8" Dynamic AMOLED 2X, 120Hz',
    color: 'Titanium Gray'
  });
  const [repairabilityScore, setRepairabilityScore] = useState<number>(8.5);
  const [resaleRange, setResaleRange] = useState<{ min: number; max: number }>({ min: 65000, max: 82000 });

  // Camera Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualInputMode, setIsManualInputMode] = useState(false);
  const [imeiHash, setImeiHash] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Created Passport Outputs
  const [generatedProductId, setGeneratedProductId] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Active Type metadata
  const currentTypeConfig = PRODUCT_TYPE_OPTIONS.find(o => o.type === productType) || PRODUCT_TYPE_OPTIONS[0];
  const isSmartphoneOrCellular = productType === 'Smartphone';

  // Check duplicate IMEI whenever serialNumber changes
  React.useEffect(() => {
    if (isSmartphoneOrCellular && serialNumber.trim().length === 15) {
      computeImeiHashClient(serialNumber.trim()).then(hash => {
        setImeiHash(hash);
        const existing = products.find(p => p.serialNumber === serialNumber.trim() || p.imeiHash === hash);
        if (existing) {
          setDuplicateWarning(`Notice: This identifier matches registered product ${existing.brand} ${existing.model} (${existing.productId}). If you acquired this device secondhand, please request an ownership transfer.`);
        } else {
          setDuplicateWarning(null);
        }
      });
    } else {
      setDuplicateWarning(null);
    }
  }, [serialNumber, isSmartphoneOrCellular, products]);

  // Demo Preset 1: Samsung Galaxy S24 Ultra (Prompt example)
  const handleLoadSamsungPreset = () => {
    setProductType('Smartphone');
    setBrand('Samsung');
    setModel('Galaxy S24 Ultra');
    setModelNumber('SM-S928B/DS');
    setPurchaseDate('2026-08-12');
    setSerialNumber('358240091284752');
    setInvoiceFileName('Samsung_SmartPlaza_Tax_Invoice_2026.pdf');
    setInvoiceFileSize('1.4 MB');
    setIsInvoiceUploaded(true);
    setSpecs({
      processor: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      ram: '12GB LPDDR5X',
      storage: '512GB UFS 4.0',
      batteryHealth: '5000 mAh (100% OEM)',
      display: '6.8" Dynamic AMOLED 2X, 120Hz',
      color: 'Titanium Gray'
    });
    setRepairabilityScore(8.5);
    setResaleRange({ min: 65000, max: 82000 });
  };

  // Demo Preset 2: Dell Inspiron 15 (Benchmark from original code)
  const handleLoadDellPreset = () => {
    setProductType('Laptop');
    setBrand('Dell');
    setModel('Inspiron 15');
    setModelNumber('Inspiron 3520');
    setPurchaseDate('2025-03-15');
    setSerialNumber('CN-0K752D-72891-49A');
    setInvoiceFileName('Dell_Authorized_Tax_Invoice_2025.pdf');
    setInvoiceFileSize('1.8 MB');
    setIsInvoiceUploaded(true);
    setSpecs({
      processor: 'Intel Core i5-1135G7',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      batteryHealth: '94% OEM',
      display: '15.6" FHD Anti-Glare',
      color: 'Platinum Silver'
    });
    setRepairabilityScore(8.5);
    setResaleRange({ min: 18000, max: 21000 });
  };

  // Handle device selection from smart autocomplete or IMEI scan
  const handleModelSelected = (device: DeviceCatalogItem) => {
    setSelectedCatalogItem(device);
    setBrand(device.brand);
    setModel(device.model);
    if (device.modelNumber) setModelNumber(device.modelNumber);
    if (device.deviceType) setProductType(device.deviceType);
    if (device.specifications) {
      setSpecs({
        ...specs,
        ...device.specifications
      });
    }
    if (device.repairabilityScore) setRepairabilityScore(device.repairabilityScore);
    if (device.estimatedResaleMin && device.estimatedResaleMax) {
      setResaleRange({ min: device.estimatedResaleMin, max: device.estimatedResaleMax });
    }
  };

  // Handle IMEI detected from Camera Scanner
  const handleImeiScanned = (detectedImei: string, lookup?: ImeiLookupResult) => {
    setSerialNumber(detectedImei);
    if (lookup?.identified && lookup.device) {
      handleModelSelected(lookup.device);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInvoiceFileName(file.name);
      setInvoiceFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setIsInvoiceUploaded(true);
    }
  };

  // Step 1 Validation -> Proceed to Step 2
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim()) {
      alert('Please select or enter the Brand and Model.');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Validation -> Proceed to Step 3
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSmartphoneOrCellular) {
      const cleanImei = serialNumber.trim();
      if (!/^\d{15}$/.test(cleanImei)) {
        alert('Smartphone registration requires a valid 15-digit IMEI number.');
        return;
      }
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Validation -> Proceed to Step 4
  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseDate) {
      alert('Please specify the purchase date.');
      return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4 Confirmation -> Mint Passport & Generate ID / QR (Step 5)
  const handleConfirmAndCreatePassport = async () => {
    // Generate unique ReTrace Product ID: RP- + BRAND(2) + 5 digits
    const brandPrefix = (brand.trim().slice(0, 2) || 'XX').toUpperCase();
    const randCode = Math.floor(10000 + Math.random() * 90000);
    
    // Benchmark IDs preservation
    let uniqueRePathId = `RP-${brandPrefix}-${randCode}`;
    if (brand.toLowerCase() === 'dell' && model.toLowerCase().includes('inspiron')) {
      uniqueRePathId = 'RP-DL-72891';
    } else if (brand.toLowerCase() === 'samsung' && model.toLowerCase().includes('s24')) {
      uniqueRePathId = 'RP-SM-72891';
    }

    const calculatedImeiHash = isSmartphoneOrCellular 
      ? await computeImeiHashClient(serialNumber.trim()) 
      : undefined;

    const maskedImeiStr = isSmartphoneOrCellular 
      ? maskIdentifier(serialNumber.trim(), true) 
      : undefined;

    createProduct({
      productId: uniqueRePathId,
      brand,
      model,
      modelNumber: modelNumber || undefined,
      category: productType,
      serialNumber: serialNumber.trim() || 'N/A',
      imeiHash: calculatedImeiHash,
      maskedImei: maskedImeiStr,
      repathProductId: uniqueRePathId,
      deviceCatalogId: selectedCatalogItem?.id,
      purchaseDate,
      invoiceName: invoiceFileName,
      condition: 'GOOD',
      warranty: selectedCatalogItem?.warranty || 'Standard OEM Warranty Active (12 Months)',
      repairabilityScore,
      estimatedResaleMin: resaleRange.min,
      estimatedResaleMax: resaleRange.max,
      lifecycleStatus: 'ACTIVE',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      image: selectedCatalogItem?.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      specs
    });

    setGeneratedProductId(uniqueRePathId);
    setCurrentStep(5);

    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.3 },
      colors: ['#F59E0B', '#06B6D4', '#10B981']
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(generatedProductId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const svgElement = document.getElementById('passport-qr-code');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReTrace_${generatedProductId}_QR_Sticker.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const maskedDisplayIdentifier = maskIdentifier(serialNumber, isSmartphoneOrCellular);
  const is15DigitImei = /^\d{15}$/.test(serialNumber.trim());
  const isLuhnCheckValid = is15DigitImei ? validateLuhn(serialNumber.trim()) : false;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 font-sans select-none">
      
      {/* Top Header & Context */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Automated Product Registration & Verification</span>
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          Register Hardware Device
        </h1>

        <p className="text-zinc-400 text-sm">
          Issue an immutable digital passport, cryptographic ID, and printable QR sticker for your physical hardware.
        </p>

        {/* 5-Step Visual Progress Bar */}
        <div className="flex items-center justify-center gap-1.5 pt-3 overflow-x-auto pb-1">
          {[
            { step: 1, label: 'Product' },
            { step: 2, label: 'Identity' },
            { step: 3, label: 'Purchase' },
            { step: 4, label: 'Review' },
            { step: 5, label: 'Passport' }
          ].map((item, idx) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <React.Fragment key={item.step}>
                <div className={`flex items-center gap-1 font-mono text-[11px] whitespace-nowrap ${
                  isActive ? 'text-amber-400 font-bold' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive 
                      ? 'bg-amber-400 text-zinc-950' 
                      : isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {isCompleted ? '✓' : item.step}
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
                {idx < 4 && (
                  <span className={`w-4 sm:w-6 h-[1px] ${isCompleted ? 'bg-emerald-500/40' : 'bg-zinc-800'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Optical Camera Scanner Modal */}
      <ImeiScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onImeiDetected={handleImeiScanned}
        onSelectDevice={handleModelSelected}
      />

      {/* =========================================================================
          STEP 1: IDENTIFY PRODUCT
          Device Type, Brand, Model Autocomplete, Model Number
          ========================================================================= */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Next} className="rounded-xl p-5 sm:p-7 bg-zinc-900 border border-zinc-800 space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <span>Step 1: Identify Product</span>
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={handleLoadSamsungPreset}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>⚡ Samsung S24 Ultra</span>
              </button>
              <span className="text-zinc-600">•</span>
              <button
                type="button"
                onClick={handleLoadDellPreset}
                className="text-zinc-400 hover:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Dell Inspiron 15</span>
              </button>
            </div>
          </div>

          {/* Quick Scanner Callout Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-400/10 via-zinc-950 to-zinc-950 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  <span>Have your device packaging or screen ready?</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400">
                  Scan the 15-digit IMEI to auto-identify the Brand, Model, and Specs in 1 second.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-zinc-950" />
              <span>📷 Scan IMEI to Identify</span>
            </button>
          </div>

          {/* 1. Device Type Selector */}
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
              Device Type / Category <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PRODUCT_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = productType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      setProductType(opt.type);
                      // Clear model when changing category to prevent invalid pairings
                      setModel('');
                      setModelNumber('');
                    }}
                    className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400 font-medium shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`} />
                    <span className="text-[11px] font-mono truncate w-full">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2 & 3. Brand & Model Selector (Smart Search Autocomplete) */}
          <DeviceModelSelector
            deviceType={productType}
            brand={brand}
            model={model}
            modelNumber={modelNumber}
            onDeviceTypeChange={setProductType}
            onBrandChange={(b) => setBrand(b)}
            onModelSelect={handleModelSelected}
            onCustomModelChange={(m) => setModel(m)}
            onModelNumberChange={(num) => setModelNumber(num)}
          />

          {/* Selected Device Specifications Card */}
          {model && (
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  Recognized Hardware Profile: {brand} {model}
                </span>
                <span className="text-emerald-400 text-[10px]">
                  Repairability: {repairabilityScore} / 10
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-zinc-300">
                {specs.processor && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">PROCESSOR</span>
                    <span className="text-zinc-200 truncate block">{specs.processor}</span>
                  </div>
                )}
                {specs.ram && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">RAM MEMORY</span>
                    <span className="text-zinc-200 truncate block">{specs.ram}</span>
                  </div>
                )}
                {specs.storage && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">STORAGE</span>
                    <span className="text-zinc-200 truncate block">{specs.storage}</span>
                  </div>
                )}
                {specs.display && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">DISPLAY</span>
                    <span className="text-zinc-200 truncate block">{specs.display}</span>
                  </div>
                )}
                {specs.batteryHealth && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">BATTERY RATING</span>
                    <span className="text-zinc-200 truncate block">{specs.batteryHealth}</span>
                  </div>
                )}
                <div>
                  <span className="text-zinc-500 block text-[10px]">RESALE ESTIMATE</span>
                  <span className="text-zinc-200">₹{resaleRange.min.toLocaleString('en-IN')} – ₹{resaleRange.max.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Continue to Device Identification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          STEP 2: IDENTIFY DEVICE
          IMEI / Serial Number, Scan IMEI button, Manual input option, Validation
          ========================================================================= */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Next} className="rounded-xl p-5 sm:p-7 bg-zinc-900 border border-zinc-800 space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Step 2: Identify Device & Serial/IMEI
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {brand} {model}
            </span>
          </div>

          {/* Device Identifier Section */}
          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-wider text-zinc-300">
                {currentTypeConfig.idLabel} <span className="text-amber-400">*</span>
              </label>
              
              {/* Scan IMEI Button & Enter Manually Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>📷 Scan IMEI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsManualInputMode(true)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 hover:underline"
                >
                  Enter IMEI manually
                </button>
              </div>
            </div>

            {/* Input field */}
            <div className="relative">
              <input
                type="text"
                required
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder={currentTypeConfig.placeholder}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium tracking-wider"
              />
              {isSmartphoneOrCellular && is15DigitImei && isLuhnCheckValid && (
                <div className="absolute right-3 top-3 text-emerald-400 flex items-center gap-1 text-xs">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Live Status Validation Badges for Smartphone IMEI */}
            {isSmartphoneOrCellular && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px]">
                <div className="flex items-center gap-3">
                  <span className={is15DigitImei ? 'text-emerald-400' : 'text-amber-400'}>
                    Length: {serialNumber.trim().length} / 15 Digits
                  </span>
                  {is15DigitImei && (
                    <span className={isLuhnCheckValid ? 'text-emerald-400' : 'text-rose-400'}>
                      {isLuhnCheckValid ? '✓ Valid Luhn Algorithm' : '⚠ Luhn Checksum Mismatch'}
                    </span>
                  )}
                </div>

                {serialNumber.trim().length > 4 && (
                  <span className="text-zinc-400">
                    Public Masked Preview: <span className="text-zinc-200 font-bold">{maskedDisplayIdentifier}</span>
                  </span>
                )}
              </div>
            )}

            {/* Duplicate Check Warning */}
            {duplicateWarning && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>{duplicateWarning}</div>
              </div>
            )}

            {/* Privacy & Masking Assurance */}
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2 leading-relaxed">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-300 block">Cryptographic Privacy Guarantee:</strong>
                ReTrace securely computes a <strong>SHA-256 hash</strong> of your IMEI to prevent counterfeit duplicate claims. Your raw 15-digit IMEI is <strong>masked ({maskedDisplayIdentifier})</strong> on public passport ledgers.
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Continue to Purchase Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          STEP 3: PURCHASE INFORMATION
          Purchase Date, Invoice / Purchase Proof
          ========================================================================= */}
      {currentStep === 3 && (
        <form onSubmit={handleStep3Next} className="rounded-xl p-5 sm:p-7 bg-zinc-900 border border-zinc-800 space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Step 3: Purchase Verification & Proof
            </span>
            <span className="text-xs font-mono text-zinc-400">Owner: {currentUser.name}</span>
          </div>

          {/* Purchase Date */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                Purchase Date <span className="text-amber-400">*</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <button
                  type="button"
                  onClick={() => setPurchaseDate(new Date().toISOString().split('T')[0])}
                  className="hover:text-amber-400 hover:underline"
                >
                  Today
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setPurchaseDate('2025-09-25')}
                  className="hover:text-amber-400 hover:underline"
                >
                  1 Year Ago
                </button>
              </div>
            </div>
            
            <input
              type="date"
              required
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 font-mono text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Invoice / Purchase Proof Upload */}
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
              Invoice / Purchase Proof (PDF, JPG, PNG)
            </label>

            <div className="border border-dashed border-zinc-700 hover:border-zinc-500 rounded-xl p-5 text-center transition-colors relative bg-zinc-950/40">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              <div className="flex flex-col items-center justify-center gap-1.5">
                <Upload className="w-6 h-6 text-amber-400" />
                <div className="text-xs font-medium text-zinc-200">
                  Click or drag invoice document here
                </div>
                <span className="font-mono text-[11px] text-zinc-500">
                  Tax invoice, retail receipt, or carrier lease agreement (up to 15MB)
                </span>
              </div>
            </div>

            {/* Uploaded File Banner */}
            {isInvoiceUploaded && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">{invoiceFileName}</span>
                  <span className="text-zinc-500 text-[10px]">({invoiceFileSize})</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Document Authenticated
                </span>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Proceed to Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          STEP 4: REVIEW
          Summary Card: Product, Masked IMEI, Purchase Date, Privacy
          ========================================================================= */}
      {currentStep === 4 && (
        <div className="rounded-xl p-5 sm:p-7 bg-zinc-900 border border-zinc-800 space-y-5 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Step 4: Review Device & Mint Passport
            </span>
            <span className="text-xs font-mono text-zinc-400">Owner: {currentUser.name}</span>
          </div>

          {/* Review Grid Matching Requirements */}
          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-2.5 font-mono text-xs">
            
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500 uppercase">PRODUCT</span>
              <span className="text-zinc-100 font-bold text-sm">{brand} {model}</span>
            </div>

            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500 uppercase">CATEGORY</span>
              <span className="text-zinc-200 font-medium">{productType}</span>
            </div>

            {modelNumber && (
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500 uppercase">MODEL NUMBER</span>
                <span className="text-zinc-300 font-medium">{modelNumber}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500 uppercase">PURCHASE DATE</span>
              <span className="text-zinc-200 font-medium">{purchaseDate}</span>
            </div>

            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500 uppercase">
                {isSmartphoneOrCellular ? 'IMEI (MASKED)' : currentTypeConfig.idLabel}
              </span>
              <span className="text-amber-400 font-bold tracking-wider">
                {maskedDisplayIdentifier}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500 uppercase">REPAIRABILITY</span>
              <span className="text-emerald-400 font-semibold">{repairabilityScore} / 10</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 uppercase">INVOICE PROOF</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {invoiceFileName} (Verified)
              </span>
            </div>
          </div>

          {/* Privacy & Identity Minting Notice */}
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-mono flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-100 block mb-0.5">Automated Identity Minting & QR Generation</strong>
              Confirming issues an immutable <strong>ReTrace Product ID</strong> (e.g. <code>RP-SM-72891</code>) and generates a verifiable <strong>QR code</strong> for attachment to your physical device. The full IMEI remains securely masked.
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmAndCreatePassport}
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Issue Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: CREATE PASSPORT (SUCCESS SCREEN)
          ReTrace Product ID, Printable QR, Download SVG, View Passport
          ========================================================================= */}
      {currentStep === 5 && (
        <div className="rounded-xl p-5 sm:p-7 bg-zinc-900 border border-zinc-800 space-y-6 text-center animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-100 tracking-tight">
              Passport Successfully Created
            </h2>
            <p className="text-zinc-400 text-xs font-mono max-w-md mx-auto">
              Scan this QR to open the product&apos;s digital passport ledger. Print the sticker below to attach it to your physical device.
            </p>
          </div>

          {/* Generated Product Passport Badge & Details */}
          <div className="p-5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 max-w-sm mx-auto space-y-3">
            <div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                Device Model
              </span>
              <div className="font-display font-bold text-lg text-zinc-100">
                {brand} {model}
              </div>
            </div>

            {/* Generated ReTrace Unique ID with Copy */}
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 block text-left">
                  ReTrace Product ID:
                </span>
                <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                  {generatedProductId}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer border border-zinc-700"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* High-Definition ReTrace QR Code for Print/Sticker */}
            <div className="p-4 rounded-lg bg-white mx-auto w-48 h-48 flex flex-col items-center justify-center border border-zinc-700 relative">
              <svg
                id="passport-qr-code"
                className="w-36 h-36 text-zinc-950"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h2v4h-2v-4zm2 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-6 2h2v2h-2v-2zm4-8h2v2h-2V8zm-2 2h2v2h-2v-2zm-2-2h2v2h-2V8zm0 4h2v2h-2v-2z" />
              </svg>
              <div className="text-[9px] font-mono text-zinc-800 font-bold tracking-wider mt-1">
                RETRACE • {generatedProductId}
              </div>
            </div>

            <p className="text-[11px] font-mono text-zinc-400">
              Route: <span className="text-amber-400">/passport/{generatedProductId}</span>
            </p>
          </div>

          {/* Action Buttons: Download QR, Print QR, View Digital Passport */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Save QR</span>
            </button>

            <button
              type="button"
              onClick={handlePrintQR}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-medium flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>Print Sticker</span>
            </button>

            <Link
              to={`/passport/${generatedProductId}`}
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="pt-3 border-t border-zinc-800">
            <Link
              to="/dashboard"
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Back to My Products Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
