import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Tv, 
  Layers, 
  Bike, 
  Sparkles, 
  Plus, 
  Cpu, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { ProductType } from '../../types';
import { DeviceDatabaseService, DeviceCatalogItem } from '../../services/deviceDatabaseService';

interface DeviceModelSelectorProps {
  deviceType: ProductType;
  brand: string;
  model: string;
  modelNumber?: string;
  onDeviceTypeChange: (type: ProductType) => void;
  onBrandChange: (brand: string) => void;
  onModelSelect: (device: DeviceCatalogItem) => void;
  onCustomModelChange?: (model: string) => void;
  onModelNumberChange?: (modelNumber: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Smartphone,
  Laptop,
  Tablet,
  Smartwatch: Watch,
  Television: Tv,
  Refrigerator: Layers,
  'Washing Machine': Layers,
  'Gaming Device': Cpu,
  Bicycle: Bike,
  Audio: Layers,
  Other: Layers
};

export const DeviceModelSelector: React.FC<DeviceModelSelectorProps> = ({
  deviceType,
  brand,
  model,
  modelNumber,
  onDeviceTypeChange,
  onBrandChange,
  onModelSelect,
  onCustomModelChange,
  onModelNumberChange
}) => {
  // Available brands for current device type
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [brandSearchInput, setBrandSearchInput] = useState('');

  // Model Search state
  const [searchQuery, setSearchQuery] = useState(model || '');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [matchedModels, setMatchedModels] = useState<DeviceCatalogItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isManualInputMode, setIsManualInputMode] = useState(false);

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Sync searchQuery if model prop changes externally (e.g. from IMEI scan)
  useEffect(() => {
    if (model && model !== searchQuery) {
      setSearchQuery(model);
    }
  }, [model]);

  // Load available brands whenever deviceType changes
  useEffect(() => {
    let isMounted = true;
    DeviceDatabaseService.searchBrands(deviceType).then(brands => {
      if (isMounted) {
        setAvailableBrands(brands);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [deviceType]);

  // Query models when brand, deviceType, or searchQuery changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingModels(true);

    const timer = setTimeout(() => {
      DeviceDatabaseService.searchModels({
        deviceType,
        brand: brand && brand !== 'All' ? brand : undefined,
        query: searchQuery
      }).then(models => {
        if (isMounted) {
          setMatchedModels(models);
          setSelectedIndex(0);
          setIsLoadingModels(false);
        }
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [deviceType, brand, searchQuery]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
        setIsBrandDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for model autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isModelDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsModelDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < matchedModels.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : matchedModels.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedModels[selectedIndex]) {
        handleSelectModelItem(matchedModels[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsModelDropdownOpen(false);
    }
  };

  const handleSelectModelItem = (device: DeviceCatalogItem) => {
    setSearchQuery(device.model);
    onModelSelect(device);
    setIsModelDropdownOpen(false);
    setIsManualInputMode(false);
  };

  const filteredBrands = availableBrands.filter(b => 
    b.toLowerCase().includes(brandSearchInput.toLowerCase())
  );

  return (
    <div className="space-y-4 font-sans" ref={dropdownRef}>
      
      {/* Brand & Model Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
        
        {/* BRAND SELECTOR (Col 5) */}
        <div className="sm:col-span-4 space-y-1.5 relative">
          <label className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
            Brand / Manufacturer <span className="text-amber-400">*</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBrandDropdownOpen(prev => !prev)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 hover:border-zinc-500 rounded-lg text-left text-sm text-zinc-100 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="font-medium truncate">{brand || 'Select Brand...'}</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            </button>

            {/* Brand Dropdown Menu */}
            {isBrandDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-64 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl z-40 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filter brands..."
                    value={brandSearchInput}
                    onChange={(e) => setBrandSearchInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                  {filteredBrands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        onBrandChange(b);
                        setIsBrandDropdownOpen(false);
                        setBrandSearchInput('');
                        // Focus model search
                        modelInputRef.current?.focus();
                        setIsModelDropdownOpen(true);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-md text-left flex items-center justify-between transition-colors cursor-pointer ${
                        brand.toLowerCase() === b.toLowerCase()
                          ? 'bg-amber-400/20 text-amber-400 font-semibold'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <span>{b}</span>
                      {brand.toLowerCase() === b.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </button>
                  ))}

                  {/* Manual Brand entry option */}
                  <div className="pt-1 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        const custom = prompt('Enter manufacturer or brand name:');
                        if (custom && custom.trim()) {
                          onBrandChange(custom.trim());
                        }
                        setIsBrandDropdownOpen(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-md text-left text-amber-400 hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Other / Unlisted Brand</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODEL SEARCH / COMMAND PALETTE (Col 8) */}
        <div className="sm:col-span-8 space-y-1.5 relative">
          <div className="flex items-center justify-between">
            <label className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
              Model Name / Selector <span className="text-amber-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setIsManualInputMode(prev => !prev);
                setIsModelDropdownOpen(false);
              }}
              className="text-[11px] font-mono text-amber-400/90 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isManualInputMode ? '⚡ Switch to Catalog Search' : 'Type custom model'}
            </button>
          </div>

          {/* Model Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-3 text-zinc-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              ref={modelInputRef}
              type="text"
              required
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onCustomModelChange) onCustomModelChange(e.target.value);
                setIsModelDropdownOpen(true);
              }}
              onFocus={() => {
                if (!isManualInputMode) setIsModelDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                brand 
                  ? `Search ${brand} models (e.g. ${brand === 'Apple' ? 'iPhone 15, MacBook Pro' : brand === 'Samsung' ? 'Galaxy S24, Tab S9' : 'Inspiron 15, XPS'})`
                  : 'Search device models (e.g. Galaxy S24, iPhone 15, Inspiron 15)...'
              }
              className="w-full pl-9 pr-9 py-2.5 bg-zinc-950 border border-zinc-700 hover:border-zinc-500 rounded-lg text-zinc-100 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium placeholder:text-zinc-600"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (onCustomModelChange) onCustomModelChange('');
                  modelInputRef.current?.focus();
                }}
                className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Smart Autocomplete Dropdown List */}
            {isModelDropdownOpen && !isManualInputMode && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl z-40 p-2 space-y-1 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                
                <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <span>Structured Device Catalog</span>
                  <span>{matchedModels.length} models matched</span>
                </div>

                {isLoadingModels && (
                  <div className="p-4 text-center text-xs font-mono text-zinc-500">
                    Searching catalog...
                  </div>
                )}

                {!isLoadingModels && matchedModels.length === 0 && (
                  <div className="p-4 text-center space-y-2">
                    <p className="text-xs font-mono text-zinc-400">
                      No matching devices found in catalog for &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualInputMode(true);
                        setIsModelDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-mono text-xs transition-colors cursor-pointer border border-zinc-700 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Use &ldquo;{searchQuery || 'Custom Device'}&rdquo; as Model</span>
                    </button>
                  </div>
                )}

                {!isLoadingModels && matchedModels.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectModelItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full p-2.5 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-400/15 border border-amber-400/40 text-zinc-100'
                          : 'bg-zinc-950/60 border border-zinc-800/80 hover:bg-zinc-800/40 text-zinc-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm flex items-center gap-2">
                          <span className="text-zinc-100 font-bold">{item.brand} {item.model}</span>
                          {item.releaseYear && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                              {item.releaseYear}
                            </span>
                          )}
                        </div>

                        {item.modelNumber && (
                          <div className="text-[11px] font-mono text-zinc-400">
                            Model No: <span className="text-zinc-300">{item.modelNumber}</span>
                          </div>
                        )}

                        {item.specifications && (
                          <div className="text-[10px] font-mono text-zinc-400 truncate max-w-md">
                            {item.specifications.processor || ''} {item.specifications.ram ? `• ${item.specifications.ram}` : ''} {item.specifications.display ? `• ${item.specifications.display}` : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {item.repairabilityScore && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Score: {item.repairabilityScore}/10
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Footer option to input manual model */}
                <div className="pt-1.5 border-t border-zinc-800 flex items-center justify-between px-2 text-[11px] font-mono text-zinc-400">
                  <span>Press ↑↓ to navigate • Enter to select</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualInputMode(true);
                      setIsModelDropdownOpen(false);
                    }}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    + Enter custom model manually
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Number (Optional / Auto-filled from Catalog) */}
      {modelNumber !== undefined && onModelNumberChange && (
        <div className="space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>OEM Model Number / Hardware Revision (Optional):</span>
            <span className="text-zinc-500">Auto-populated from catalog when available</span>
          </div>
          <input
            type="text"
            value={modelNumber}
            onChange={(e) => onModelNumberChange(e.target.value)}
            placeholder="e.g. SM-S928B/DS, A3106, 21HM0004US..."
            className="w-full px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-xs focus:border-amber-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
