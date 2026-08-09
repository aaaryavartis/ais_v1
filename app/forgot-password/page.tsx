'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CandidateService } from '@/lib/candidate-service';
import { Mail, ArrowLeft, SendHorizonal, CheckCircle2, KeyRound, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [resetLink, setResetLink] = useState(''); // shown in-app since no real email service

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    // Small artificial delay for UX
    await new Promise((r) => setTimeout(r, 900));

    const token = CandidateService.generateResetToken(email);
    setIsLoading(false);

    if (!token) {
      // Don't reveal whether email exists — show same success UI (security best practice)
      toast.info('If this email is registered, a reset link will appear below.');
    }

    // Build the reset URL with token
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = token ? `${origin}/reset-password?token=${token}` : '';
    setResetLink(link);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">

        {/* Back link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {/* Card */}
        <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">

          {!isSent ? (
            <>
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto">
                  <KeyRound className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  No worries. Enter your registered email and we&apos;ll generate a secure password reset link for you.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Reset Link...
                    </>
                  ) : (
                    <>
                      <SendHorizonal className="w-4 h-4" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-[11px] text-slate-400">
                Remember your password?{' '}
                <Link href="/login" className="text-brand-600 font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </>
          ) : (
            /* ── Success State ── */
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Check Your Link Below</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Since this app uses local auth (no email server), your reset link is shown directly below. In production, this would arrive in your inbox.
                </p>
              </div>

              {resetLink ? (
                <div className="space-y-3">
                  {/* Reset link display box */}
                  <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-left space-y-2">
                    <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      Your Password Reset Link (valid 15 minutes):
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 break-all font-mono">
                      {resetLink}
                    </p>
                  </div>

                  <Link
                    href={resetLink}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition"
                  >
                    <KeyRound className="w-4 h-4" />
                    Open Reset Password Page
                  </Link>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-left">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    This email is not registered in our system. Please{' '}
                    <Link href="/register" className="font-bold hover:underline">create a free account</Link>{' '}
                    or try a different email.
                  </p>
                </div>
              )}

              <button
                onClick={() => { setIsSent(false); setEmail(''); setResetLink(''); }}
                className="text-xs text-slate-400 hover:text-slate-600 hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
