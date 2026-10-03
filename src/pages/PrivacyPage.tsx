import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 font-sans select-none">
      
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>PRIVACY ARCHITECTURE</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono">
            Effective Date: September 2026 • ReTrace Protocol v2.8
          </p>
        </div>
      </div>

      {/* Main Privacy Text Blocks */}
      <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-8 text-zinc-300 text-sm leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            1. Privacy-by-Design Overview
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            ReTrace is engineered as a physical hardware lifecycle registry. We prioritize the preservation of machine telemetry, diagnostic history, and repair authenticity without compiling behavioral user dossiers or collecting surveillance advertising data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            2. Information Recorded in Product Passports
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            When you create or update a ReTrace digital product passport, the following data is logged to the ledger:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-zinc-400">
            <li>Hardware brand, model, and serial number hashes.</li>
            <li>Operating conditions, battery health percentages, and charge cycle counts.</li>
            <li>Component replacement records and verified technician digital signatures.</li>
            <li>Cryptographic timestamps for proof of maintenance.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            3. Ownership Transfer & Personal Data Decoupling
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            When a device is transferred or resold on the secondary market, personal identification (such as private purchase invoices or personal email credentials) is decoupled from the public device ledger. The subsequent owner receives verified hardware history without access to previous owners&apos; confidential identities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            4. AI Assistant Context Usage
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Inquiries submitted to ReTrace AI are analyzed in real-time by Google Gemini. Product specifications (e.g. Dell Inspiron 15, battery cycle count) are provided as system context strictly to generate safe, accurate diagnostic guidance. Your conversations are not sold to data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-bold text-lg text-white">
            5. Contact Information & Data Subject Rights
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Under GDPR, CCPA, and the EU Ecodesign regulation (ESPR), you have the right to inspect, export, or request deletion of personal off-chain account data. To make an inquiry, email our Data Protection Officer at <span className="text-amber-400 font-mono">privacy@retrace.io</span>.
          </p>
        </section>

      </div>

    </div>
  );
};
