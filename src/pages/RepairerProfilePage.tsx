import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RepairRequestModal } from '../components/modals/RepairRequestModal';
import { 
  Wrench, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Send,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RepairerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    repairers, 
    getRepairer, 
    products, 
    currentUser, 
    getRepairerReviews, 
    addRepairReview 
  } = useApp();

  const targetRepairer = (id ? getRepairer(id) : null) || repairers[0];
  const reviews = targetRepairer ? getRepairerReviews(targetRepairer.id) : [];

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewTextInput, setReviewTextInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!targetRepairer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-white">Repairer Not Found</h2>
          <Link to="/repairers" className="text-amber-400 font-mono text-sm underline">
            Browse All Repairers
          </Link>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTextInput.trim()) return;

    addRepairReview({
      repairerId: targetRepairer.id,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      rating: Number(ratingInput),
      review: reviewTextInput.trim(),
      verified: true
    });

    setReviewSubmitted(true);
    setReviewTextInput('');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981']
    });

    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 font-sans">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {targetRepairer.verificationStatus === 'VERIFIED' ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ ReTrace Verified</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Pending Verification</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Profile Showcase Card */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
        
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b border-zinc-800 pb-6">
          
          {/* Shop Photo */}
          <div className="relative flex-shrink-0">
            <img
              src={targetRepairer.avatar || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'}
              alt={targetRepairer.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border border-zinc-800"
            />
            {targetRepairer.verificationStatus === 'VERIFIED' && (
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-mono font-semibold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                Active Workshop
              </span>
              <span className="font-mono text-xs text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>{targetRepairer.city || targetRepairer.location}</span>
              </span>
              <span className="font-mono text-xs text-zinc-500">
                • {targetRepairer.experienceYears || 6} Years Experience
              </span>
            </div>

            <h1 className="font-display font-semibold text-2xl sm:text-3xl text-zinc-100 tracking-tight">
              {targetRepairer.name}
            </h1>

            <p className="font-mono text-xs text-amber-400 font-medium">
              {targetRepairer.specialty}
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap font-mono text-xs">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-zinc-100">
                  {targetRepairer.rating > 0 ? targetRepairer.rating.toFixed(1) : 'New'}
                </span>
                <span className="text-zinc-500 text-xs">
                  ({targetRepairer.reviewCount} reviews)
                </span>
              </div>

              <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                {targetRepairer.completedRepairs} Completed ReTrace Repairs
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
              {targetRepairer.description}
            </p>
          </div>
        </div>

        {/* Action Buttons Strip */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            <span>Request Repair</span>
          </button>

          <button
            onClick={() => setShowLocationModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 font-mono text-xs font-medium border border-zinc-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span>View Location</span>
          </button>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ml-auto border border-zinc-700/60"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>{showReviewForm ? 'Close Review Form' : 'Rate & Review'}</span>
          </button>
        </div>

        {/* Review Submission Accordion */}
        {showReviewForm && (
          <form 
            onSubmit={handleReviewSubmit}
            className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="font-display font-semibold text-zinc-100 text-sm">
                Submit Verified Customer Review
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                Audited Digital Rating
              </span>
            </div>

            {reviewSubmitted ? (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs text-center">
                ✓ Review submitted successfully! Top Repairers rank score updated.
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-zinc-400">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star 
                          className={`w-5 h-5 transition-colors ${
                            star <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-xs font-semibold text-amber-400">
                    {ratingInput}.0 ★
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">
                    Your Verified Work Experience
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewTextInput}
                    onChange={(e) => setReviewTextInput(e.target.value)}
                    placeholder="Describe the diagnostics, replacement parts, turnaround time, and ReTrace passport experience..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-sans focus:border-zinc-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Verified Review</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* SERVICES OFFERED */}
        <div className="space-y-2.5 pt-4 border-t border-zinc-800">
          <h3 className="font-mono text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Services Offered
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(targetRepairer.services || ['Laptop Repair', 'Battery Replacement', 'Thermal Cleaning', 'Screen Replacement']).map((srv) => (
              <div 
                key={srv}
                className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs font-mono text-zinc-300 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BRAND SPECIALIZATIONS */}
        <div className="space-y-2.5 pt-4 border-t border-zinc-800">
          <h3 className="font-mono text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Brand Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {(targetRepairer.specializations || ['Dell', 'HP', 'Lenovo']).map((spec) => (
              <span
                key={spec}
                className="px-3 py-1.5 rounded-md bg-zinc-950/60 text-zinc-300 border border-zinc-800 text-xs font-mono"
              >
                {spec} Authorized Protocols
              </span>
            ))}
          </div>
        </div>

        {/* OPENING HOURS */}
        <div className="space-y-2.5 pt-4 border-t border-zinc-800">
          <h3 className="font-mono text-xs text-zinc-400 font-semibold uppercase tracking-wider">
            Opening Hours
          </h3>
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs font-mono">
            <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-zinc-200 font-medium">
                {targetRepairer.openingHours || '10:00 AM – 8:00 PM'}
              </div>
              <div className="text-zinc-500 text-[11px] mt-0.5">
                Status: <strong className="text-emerald-400 font-medium">{targetRepairer.availability || 'OPEN'}</strong> • Response Time: {targetRepairer.responseTime || '< 1 hour'}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Verified Customer Reviews ({reviews.length})
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">
              Immutably tied to repair work orders
            </span>
          </div>

          <div className="space-y-2.5">
            {reviews.length === 0 ? (
              <div className="p-6 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-center text-zinc-500 font-mono text-xs">
                No reviews logged yet. Be the first to rate this workshop.
              </div>
            ) : (
              reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-medium text-zinc-200 text-xs">
                        {rev.ownerName}
                      </span>
                      {rev.verified && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          ✓ Verified Customer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                  <div className="text-[10px] font-mono text-zinc-500">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="font-display font-semibold text-zinc-100 text-base">
                Shop Location & Address
              </div>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-zinc-500 hover:text-zinc-200 font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1">
                <div className="text-amber-400 font-semibold">{targetRepairer.name}</div>
                <div className="text-zinc-300">{targetRepairer.address || targetRepairer.location}</div>
                <div className="text-zinc-500 text-[11px]">
                  {targetRepairer.city}, {targetRepairer.state} - {targetRepairer.pincode}
                </div>
              </div>

              <div className="h-40 rounded-lg bg-zinc-950 border border-zinc-800 relative overflow-hidden flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-amber-400/20 animate-ping absolute" />
                <div className="flex flex-col items-center relative z-10">
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 font-bold text-xs">
                    TF
                  </div>
                  <span className="text-[10px] text-zinc-300 font-medium mt-1">
                    {targetRepairer.name}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3 text-[9px] text-zinc-500">
                  LAT: {targetRepairer.latitude || 26.8467} • LNG: {targetRepairer.longitude || 80.9462}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 font-mono text-xs font-medium cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Repair Request Modal */}
      {isRequestModalOpen && (
        <RepairRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          product={products[0]}
          preselectedRepairer={targetRepairer}
        />
      )}
    </div>
  );
};
