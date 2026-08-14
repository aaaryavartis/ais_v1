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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      const user = await UserService.login(email, password);
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


  return (
    <div className="py-16 mx-auto max-w-md px-4 sm:px-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30">
          <LogIn className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Aaryavart Integrated Services Sign In
        </h1>
        <p className="text-xs text-slate-500">
          Unified Login Portal for Candidates & Recruitment Admins
        </p>
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password *
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-brand-600 hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
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
