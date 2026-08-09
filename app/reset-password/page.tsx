'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CandidateService } from '@/lib/candidate-service';
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'One uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'One number', pass: /[0-9]/.test(password) },
    { label: 'One special character', pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.pass).length;
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-600'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="space-y-2 mt-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < score ? colors[score] : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-[10px] font-semibold ${score >= 3 ? 'text-emerald-600' : 'text-amber-500'}`}>
          {labels[score]} password
        </p>
      )}
      {/* Checklist */}
      {password && (
        <ul className="space-y-1">
          {checks.map((c) => (
            <li key={c.label} className={`flex items-center gap-1.5 text-[10px] ${c.pass ? 'text-emerald-600' : 'text-slate-400'}`}>
              {c.pass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [tokenEmail, setTokenEmail] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // With Supabase, the token verification is handled automatically by the client
    // when the user clicks the email link.
    setTokenValid(true);
    setTokenEmail('your account');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    try {
      await CandidateService.resetPassword(password);
      setIsDone(true);
      toast.success('Password reset successfully! Please sign in.');
    } catch (e) {
      toast.error('Reset link has expired or is invalid. Please request a new one.');
    }
    setIsLoading(false);
  };

  // Loading state while verifying token
  if (tokenValid === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <span className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Verifying reset link...</p>
      </div>
    );
  }

  // Invalid / expired token
  if (!tokenValid) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Link Invalid or Expired</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            This password reset link is no longer valid. Reset links expire after 15 minutes.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition"
        >
          Request a New Reset Link
        </Link>
      </div>
    );
  }

  // Success state
  if (isDone) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Password Reset!</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition"
        >
          <ArrowRight className="w-4 h-4" />
          Go to Sign In
        </Link>
      </div>
    );
  }

  // Main reset form
  return (
    <>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7 text-brand-600 dark:text-brand-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Set New Password
        </h1>
        {tokenEmail && (
          <p className="text-xs text-slate-500">
            Resetting password for{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{tokenEmail}</span>
          </p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* New Password */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            New Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrengthBar password={password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Confirm New Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
              className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Passwords do not match
            </p>
          )}
          {confirmPassword && confirmPassword === password && (
            <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Passwords match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !password || password !== confirmPassword}
          className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Reset Password
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
        >
          ← Back to Sign In
        </Link>
        <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl space-y-6">
          <Suspense fallback={
            <div className="flex flex-col items-center gap-3 py-10">
              <span className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
