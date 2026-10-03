import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Building2, 
  Wrench, 
  Recycle, 
  LifeBuoy, 
  ShieldCheck 
} from 'lucide-react';

const INQUIRY_TYPES = [
  { id: 'GENERAL_ENQUIRY', label: 'GENERAL ENQUIRY', desc: 'Protocol questions, partnerships, and media', icon: Building2 },
  { id: 'REPAIRER_SUPPORT', label: 'REPAIRER SUPPORT', desc: 'Shop verification, onboarding, or work orders', icon: Wrench },
  { id: 'RECOVERY_PARTNER', label: 'RECOVERY PARTNER', desc: 'R2v3 recycling and material smelting routing', icon: Recycle },
  { id: 'TECHNICAL_SUPPORT', label: 'TECHNICAL SUPPORT', desc: 'Passport resolution, QR scans, or telemetry issues', icon: LifeBuoy },
  { id: 'FEEDBACK', label: 'FEEDBACK', desc: 'Suggestions to improve the circular user experience', icon: MessageSquare }
];

export const ContactPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState('GENERAL_ENQUIRY');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    // Simulate secure storage and generate tracking ticket ID
    setTimeout(() => {
      const generatedTicket = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Store in localStorage for audit persistence
      const previous = JSON.parse(localStorage.getItem('retrace_contact_messages') || '[]');
      previous.push({
        ticketId: generatedTicket,
        name,
        email,
        subject: subject || selectedType,
        inquiryType: selectedType,
        message,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('retrace_contact_messages', JSON.stringify(previous));

      setTicketId(generatedTicket);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTicketId(null);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 font-sans select-none">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>DIRECT PROTOCOL SUPPORT</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
          Get in Touch with ReTrace
        </h1>

        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          Whether you are an independent repair shop, a recycling facility, or an enterprise needing passport integration, our protocol team responds within 4 hours.
        </p>
      </div>

      {ticketId ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-5 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
              DISPATCH CONFIRMED
            </span>
            <h3 className="font-display font-bold text-2xl text-white">
              Message Received
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Your message has been securely recorded. Our team has routed this ticket to the relevant engineering or support coordinator.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400 max-w-xs mx-auto">
            <span>TICKET REFERENCE:</span>
            <div className="text-sm font-bold text-emerald-400 mt-1">{ticketId}</div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-8">
          
          {/* Inquiry Options Selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider block">
              Select Department / Inquiry Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {INQUIRY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400/40 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold leading-tight">
                        {type.label}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {type.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your question or inquiry..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Message Content *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details about your hardware, shop registration, or inquiry..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-zinc-500">
                Official contact: <span className="text-zinc-300">support@retrace.io</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{isSubmitting ? 'DISPATCHING...' : 'SEND MESSAGE'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
