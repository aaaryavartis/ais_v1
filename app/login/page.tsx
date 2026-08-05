'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '@/lib/user-service';
import { LogIn, Mail, Lock, ShieldCheck, UserCheck, ArrowRight, Info, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      const user = UserService.login(email);
      if (user) {
        toast.success(`Welcome back, ${user.name}! Signed in as ${user.role.toUpperCase()}`);
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/candidate/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleAutofillAdmin = () => {
    setEmail('admin@aaryaraakh.com');
    setPassword('Admin@12345');
    toast.info('Demo Admin credentials autofilled!');
  };

  const handleAutofillCandidate = () => {
    setEmail('candidate@example.com');
    setPassword('Candidate@12345');
    toast.info('Demo Candidate credentials autofilled!');
  };

  return (
    <div className="py-16 mx-auto max-w-md px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
          <LogIn className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Aarya Raakh Sign In
        </h1>
        <p className="text-xs text-slate-500">
          Unified Login Portal for Candidates & Recruitment Admins
        </p>
      </div>

      {/* Demo Account Switcher Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Quick Demo Account Autofills:</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAutofillCandidate}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-500/30 hover:border-brand-500 text-left transition"
          >
            <div className="font-bold text-brand-600 text-[11px] flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> Candidate Login
            </div>
            <div className="text-[10px] text-slate-500 truncate">candidate@example.com</div>
          </button>

          <button
            type="button"
            onClick={handleAutofillAdmin}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-500/30 hover:border-purple-500 text-left transition"
          >
            <div className="font-bold text-purple-600 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </div>
            <div className="text-[10px] text-slate-500 truncate">admin@aaryaraakh.com</div>
          </button>
        </div>
      </div>

      {/* Login Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
              Sign In to Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Need a Candidate Account?{' '}
          <Link href="/register" className="font-bold text-brand-600 hover:underline">
            Register Candidate Account
          </Link>
        </div>
      </div>
    </div>
  );
}
