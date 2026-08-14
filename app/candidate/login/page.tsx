'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CandidateService } from '@/lib/candidate-service';
import { UserCheck, Mail, Lock, ArrowRight, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CandidateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your candidate email');
      return;
    }

    CandidateService.loginCandidate(email);
    toast.success('Candidate login successful!');
    router.push('/candidate/dashboard');
  };

  const handleAutofillDemo = () => {
    setEmail('candidate@example.com');
    setPassword('Candidate@12345');
    toast.info('Demo candidate credentials autofilled!');
  };

  return (
    <div className="py-16 mx-auto max-w-md px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Candidate Login Portal
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to access One-Click Quick Apply & track your job applications
        </p>
      </div>

      {/* Demo Credentials Alert Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Candidate Account</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
          <strong>Email:</strong> candidate@example.com <br />
          <strong>Password:</strong> Candidate@12345
        </p>
        <button
          type="button"
          onClick={handleAutofillDemo}
          className="text-[11px] font-bold text-brand-600 hover:underline pt-1 block"
        >
          Click to Autofill Demo Candidate Credentials →
        </button>
      </div>

      {/* Login Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Candidate Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/25 transition flex items-center justify-center gap-2"
            >
              Candidate Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          New to Aaryavart Integrated Services?{' '}
          <Link href="/candidate/register" className="font-bold text-brand-600 hover:underline">
            Register Candidate Account
          </Link>
        </div>
      </div>
    </div>
  );
}
