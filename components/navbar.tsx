'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserService } from '@/lib/user-service';
import { UserAccount } from '@/lib/types';
import { Briefcase, FileUp, ShieldCheck, Menu, X, UserCheck, User, Building2, LogOut, LogIn } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    setCurrentUser(UserService.getCurrentUser());
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/jobs', label: 'Job Openings' },
    { href: '/register', label: 'Candidate Register' },
    { href: '/#about', label: 'About Us' },
    { href: '/#contact', label: 'Contact Us' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="glass-panel rounded-2xl sm:rounded-3xl px-5 py-3 shadow-ios flex items-center justify-between transition-all border border-slate-200/60 dark:border-slate-800">
          
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Aarya Raakh
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide hidden sm:block">
                Connecting Talent with Opportunities
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <Link
                href={currentUser.role === 'admin' ? '/admin' : '/candidate/dashboard'}
                className="px-3.5 py-2 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 rounded-full flex items-center gap-1.5 hover:bg-brand-500/20 transition"
              >
                {currentUser.role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Portal
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-brand-600" /> My Dashboard
                  </>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 flex items-center gap-1.5 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogIn className="w-4 h-4 text-brand-600" />
                Sign In
              </Link>
            )}

            <Link
              href="/register"
              className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 rounded-full shadow-md shadow-brand-600/25 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FileUp className="w-4 h-4" />
              Register Profile
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 my-2 glass-panel rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded-2xl transition ${
                  isActive(link.href)
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              {currentUser ? (
                <Link
                  href={currentUser.role === 'admin' ? '/admin' : '/candidate/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 text-sm font-bold text-brand-600 bg-brand-500/10 rounded-2xl flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {currentUser.role === 'admin' ? 'Admin Portal' : 'My Candidate Dashboard'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-brand-600" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
