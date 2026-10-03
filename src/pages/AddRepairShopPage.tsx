import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Camera,
  Layers,
  Phone,
  Mail,
  User,
  Navigation,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRODUCT_CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Tablets',
  'Smartwatches',
  'TVs',
  'Home Appliances',
  'Gaming Devices',
  'Bicycles',
  'Other'
];

const BRAND_SPECIALIZATIONS = [
  'Apple',
  'Samsung',
  'Dell',
  'HP',
  'Lenovo',
  'OnePlus',
  'Asus',
  'Sony',
  'Bose'
];

const ISSUE_TYPES = [
  'Screen Repair',
  'Battery Replacement',
  'Charging Problems',
  'Overheating',
  'Software Problems',
  'Hardware Problems',
  'Motherboard Repair',
  'General Maintenance'
];

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80'
];

export const AddRepairShopPage: React.FC = () => {
  const { addRepairShop, currentUser, switchRole } = useApp();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdShopId, setCreatedShopId] = useState<string | null>(null);

  // Form State
  // Step 1: Basic Info
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState(currentUser.email || '');
  const [photoUrl, setPhotoUrl] = useState(DEFAULT_AVATARS[0]);
  const [customPhotoFileName, setCustomPhotoFileName] = useState<string | null>(null);

  // Step 2: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState<number>(26.8467);
  const [longitude, setLongitude] = useState<number>(80.9462);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationMode, setLocationMode] = useState<'AUTO' | 'MANUAL'>('MANUAL');

  // Step 3: Services
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Smartphones', 'Laptops']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Dell', 'HP', 'Lenovo']);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>([
    'Screen Repair', 
    'Battery Replacement', 
    'Overheating', 
    'Motherboard Repair'
  ]);

  // Step 4: Basic Shop Details
  const [openingHours, setOpeningHours] = useState('Mon–Sat: 10:00 AM – 8:00 PM | Sun: Closed');
  const [experienceYears, setExperienceYears] = useState(5);
  const [shortDescription, setShortDescription] = useState(
    'Specialized in laptop diagnostics, thermal repair and component replacement with certified cryptographic ReTrace logging.'
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setLocationMode('AUTO');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(Number(position.coords.latitude.toFixed(4)));
          setLongitude(Number(position.coords.longitude.toFixed(4)));
          if (!city) setCity('Local Metro');
          if (!state) setState('Current Region');
          setIsDetectingLocation(false);
        },
        () => {
          // Fallback coordinate
          setLatitude(26.8467);
          setLongitude(80.9462);
          if (!city) setCity('Lucknow');
          if (!state) setState('Uttar Pradesh');
          setIsDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleIssueType = (issue: string) => {
    setSelectedIssueTypes(prev => 
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newShopId = addRepairShop({
      name: shopName.trim() || 'TechRepair Studio',
      ownerName: ownerName.trim() || 'Shop Owner',
      phone: phone.trim() || '+91 98000 00000',
      email: email.trim() || 'shop@retrace.io',
      specialty: `${selectedCategories.slice(0, 2).join(' & ')} Specialist`,
      category: selectedCategories,
      distanceKm: 2.0,
      location: `${address ? address + ', ' : ''}${city || 'Lucknow'}`,
      address: address.trim(),
      city: city.trim() || 'Lucknow',
      state: state.trim() || 'Uttar Pradesh',
      pincode: pincode.trim() || '226001',
      latitude,
      longitude,
      experienceYears: Number(experienceYears) || 3,
      openingHours: openingHours.trim() || 'Mon–Sat: 10:00 AM – 8:00 PM',
      availability: 'OPEN',
      description: shortDescription.trim(),
      services: selectedIssueTypes.slice(0, 5),
      specializations: selectedBrands,
      issueTypes: selectedIssueTypes,
      hourlyRate: 850,
      avatar: photoUrl,
      responseTime: '< 2 hours',
      certifications: ['ReTrace Onboarding Applicant', 'Hardware Diagnostics Standard']
    });

    setCreatedShopId(newShopId);
    setCurrentStep(5);

    // If current role is not REPAIRER, switch to REPAIRER so they can manage their portal
    if (currentUser.role !== 'REPAIRER') {
      switchRole('REPAIRER');
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#F59E0B', '#10B981', '#06B6D4']
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link 
          to="/repairer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Repairer Portal</span>
        </Link>

        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-400 px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20">
          <Wrench className="w-3.5 h-3.5" />
          <span>Repair Shop Registration</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
          Register Your Repair Shop
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Join the ReTrace hardware network. Complete your shop profile to receive verified diagnostic requests and issue digital lifecycle certificates.
        </p>
      </div>

      {/* 5-Step Visual Stepper Bar */}
      <div className="rounded-xl p-3 bg-zinc-900 border border-zinc-800">
        <div className="grid grid-cols-5 gap-2 font-mono text-[11px]">
          {[
            { num: 1, label: 'BASIC INFO' },
            { num: 2, label: 'LOCATION' },
            { num: 3, label: 'SERVICES' },
            { num: 4, label: 'DETAILS' },
            { num: 5, label: 'STATUS' }
          ].map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div 
                key={s.num}
                className={`p-2 rounded-lg text-center border transition-colors ${
                  isCurrent
                    ? 'bg-amber-400 text-zinc-950 font-semibold border-amber-400'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-zinc-950/60 text-zinc-500 border-zinc-800'
                }`}
              >
                <div className="text-[10px] opacity-75">STEP 0{s.num}</div>
                <div className="truncate hidden sm:block font-medium">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Form Body */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          
          {/* =========================================================================
              STEP 1 — BASIC INFORMATION
              Shop Name, Owner, Phone, Email, Profile/Shop Photo
              ========================================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  STEP 1 OF 4
                </span>
                <h2 className="font-display font-bold text-2xl text-white">
                  Basic Shop Information
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Primary business identity and public listing contact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Shop Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-300 flex items-center justify-between">
                    <span>SHOP NAME *</span>
                    <span className="text-zinc-500 text-[10px]">e.g. TechFix</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="TechFix Solutions"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Owner / Contact Person */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">OWNER / CONTACT PERSON *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Marcus Vance"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">PHONE NUMBER *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12891"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-300">EMAIL ADDRESS *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@techfix.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Profile / Shop Photo Upload */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-mono text-zinc-300 block">
                  PROFILE / SHOP PHOTO (JPG, PNG) *
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-black/40 border border-white/[0.08]">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/40 shadow-lg flex-shrink-0"
                  />

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {customPhotoFileName && (
                        <span className="text-xs font-mono text-emerald-400">
                          ✓ {customPhotoFileName}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-zinc-500">
                      Upload your shop storefront or technician workspace. Clear images improve customer conversion by 42%.
                    </p>
                  </div>
                </div>

                {/* Preset Avatars Fallback */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">OR SELECT DEFAULT VERIFIED WORKSHOP AVATAR:</span>
                  <div className="flex gap-2">
                    {DEFAULT_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(url);
                          setCustomPhotoFileName(null);
                        }}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          photoUrl === url ? 'border-amber-400 scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-end pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    if (!shopName.trim()) {
                      alert('Please provide your Shop Name');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>CONTINUE TO LOCATION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 2 — LOCATION
              Shop Address, City, State, Pincode, Use Current Location OR Enter Manually
              ========================================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  STEP 2 OF 4
                </span>
                <h2 className="font-display font-bold text-2xl text-white">
                  Shop Physical Location
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Enables proximity-based repairer discovery for nearby customer devices.
                </p>
              </div>

              {/* Method Picker: Current Location vs Manual */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Detecting Coordinates...' : 'Use Current Location'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationMode('MANUAL')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    locationMode === 'MANUAL'
                      ? 'bg-white/[0.08] text-white border border-white/20'
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Enter Manually
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Shop Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-zinc-300">SHOP ADDRESS *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Hazratganj Tech Hub, 4th Floor, Suite 402"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">CITY *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lucknow"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* State */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">STATE *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Uttar Pradesh"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Pincode */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">PINCODE *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="226001"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Stored Coordinates Display */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">COORDINATES (LAT / LONG)</label>
                  <div className="px-4 py-3 rounded-xl bg-black/30 border border-white/[0.08] text-xs font-mono text-cyan-400 flex items-center justify-between">
                    <span>LAT: {latitude}</span>
                    <span>LNG: {longitude}</span>
                  </div>
                </div>
              </div>

              {/* Privacy Shield Notice */}
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-xs font-mono text-zinc-400 space-y-1">
                <div className="text-amber-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>PRIVACY NOTICE</span>
                </div>
                <p>
                  Exact private physical coordinates are shielded. Customers are only shown approximate distance (e.g. &ldquo;1.5 km away&rdquo;) until an appointment is confirmed.
                </p>
              </div>

              {/* Navigation Action */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white font-mono text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!city.trim()) {
                      alert('Please provide your city');
                      return;
                    }
                    setCurrentStep(3);
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>CONTINUE TO SERVICES</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 3 — SERVICES
              What do you repair? + Specializations + Issue Types
              ========================================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  STEP 3 OF 4
                </span>
                <h2 className="font-display font-bold text-2xl text-white">
                  Services & Specializations
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Select the hardware types, manufacturer brands, and repair diagnostics your bench supports.
                </p>
              </div>

              {/* 1. What do you repair? Checkboxes */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono text-amber-400 font-bold block">
                  WHAT DO YOU REPAIR? (CHECK ALL THAT APPLY) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`p-3 rounded-xl border text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold shadow-sm'
                            : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Brand Specializations */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-mono text-cyan-400 font-bold block">
                  BRAND SPECIALIZATIONS
                </label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_SPECIALIZATIONS.map((brand) => {
                    const isSelected = selectedBrands.includes(brand);
                    return (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                            : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {brand} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Issue Types */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-mono text-emerald-400 font-bold block">
                  ISSUE TYPES RESOLVED
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ISSUE_TYPES.map((issue) => {
                    const isSelected = selectedIssueTypes.includes(issue);
                    return (
                      <button
                        type="button"
                        key={issue}
                        onClick={() => toggleIssueType(issue)}
                        className={`p-3 rounded-xl border text-xs font-mono text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-black/40 border-white/[0.08] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{issue}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white font-mono text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCategories.length === 0) {
                      alert('Please select at least one device category you repair');
                      return;
                    }
                    setCurrentStep(4);
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>CONTINUE TO DETAILS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 4 — BASIC SHOP DETAILS
              Opening Hours, Years of Experience, Short Description
              ========================================================================= */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  STEP 4 OF 4
                </span>
                <h2 className="font-display font-bold text-2xl text-white">
                  Basic Shop Details
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Operating schedule and technician experience overview.
                </p>
              </div>

              <div className="space-y-5">
                {/* Opening Hours */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 flex items-center justify-between">
                    <span>OPENING HOURS *</span>
                    <span className="text-zinc-500 text-[10px]">e.g. Mon–Sat: 10:00 AM – 8:00 PM</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="Mon–Sat: 10:00 AM – 8:00 PM | Sun: Closed"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300">
                    YEARS OF EXPERIENCE *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-300 flex items-center justify-between">
                    <span>SHORT DESCRIPTION *</span>
                    <span className="text-zinc-500 text-[10px]">Brief summary of your workshop</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Specialized in laptop diagnostics, thermal repair and component replacement."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.1] text-white text-sm font-sans focus:border-amber-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Pre-submission Summary Preview */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2 text-xs font-mono">
                <div className="text-zinc-500 uppercase tracking-widest text-[10px]">REGISTRATION SUMMARY</div>
                <div className="flex justify-between text-zinc-300">
                  <span>Shop:</span> <strong className="text-white">{shopName || 'TechFix'}</strong>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Location:</span> <span>{city || 'Lucknow'}, {state || 'Uttar Pradesh'}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Initial Status:</span> <span className="text-amber-400 font-bold">PENDING VERIFICATION</span>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white font-mono text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>REGISTER REPAIR SHOP</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STEP 5 — SUBMISSION CONFIRMATION
              Status: PENDING VERIFICATION (Admin must verify before ReTrace Verified)
              ========================================================================= */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-6"
            >
              <div className="w-20 h-20 rounded-full bg-amber-400/10 border-2 border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(245,158,11,0.25)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs text-amber-400 tracking-widest uppercase block">
                  REGISTRATION RECEIVED
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                  REPAIR SHOP CREATED
                </h2>
                <p className="text-sm font-mono text-zinc-400 max-w-md mx-auto">
                  {shopName} has been enrolled into the ReTrace database.
                </p>
              </div>

              {/* Status Badge Box */}
              <div className="p-6 rounded-3xl bg-black/60 border border-amber-400/30 max-w-md mx-auto space-y-3">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  CURRENT VERIFICATION STATUS
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-300 font-mono font-bold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>STATUS: PENDING VERIFICATION</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-400 leading-relaxed pt-2">
                  To preserve consumer security, new repair workshops do not immediately receive the <strong>✓ ReTrace Verified</strong> badge. The ReTrace Protocol Admin will inspect your workshop credentials.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {createdShopId && (
                  <Link
                    to={`/repairers/${createdShopId}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-mono text-xs font-semibold border border-white/[0.1] transition-colors"
                  >
                    VIEW PUBLIC PROFILE
                  </Link>
                )}

                <Link
                  to="/repairer/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>GO TO REPAIRER PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
