'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden">
                <img src="/logo.svg" alt="Aaryavart integrated services Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Aaryavart integrated services
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connecting premier talent with industry-leading corporate opportunities across IT, BFSI, Healthcare, Manufacturing, Engineering, Retail, and other key sectors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Explore Openings
                </Link>
              </li>
              <li>
                <Link href="/resume-upload" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Candidate Resume Bank
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Industries
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>IT, Technology, & BFSI</li>
              <li>Healthcare & Pharmaceuticals</li>
              <li>Manufacturing & Engineering</li>
              <li>Retail, E-commerce, & Logistics</li>
              <li>Real Estate, Hospitality, & Education</li>
              <li>FMCG, Sales, & Customer Support</li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Headquarters
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>swami vivekanand nagar , makhmalabad , nashik</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <span>aaryavart.services@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                <span>9529890296</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Aaryavart integrated services Recruitment Agency. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
