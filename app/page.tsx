'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { JobCard } from '@/components/job-card';
import { ApplyModal } from '@/components/apply-modal';
import { ContactSection } from '@/components/contact-section';
import {
  Briefcase,
  FileUp,
  ShieldCheck,
  Award,
  Users,
  Building2,
  Zap,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const jobs = await DataService.getLatestOpenings(6);
        setLatestJobs(jobs);
      } catch (e) {
        console.error('Failed to load latest jobs:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const whyChooseUsCards = [
    {
      title: 'Verified Opportunities',
      description: '100% background-checked employer openings from reputed corporations.',
      icon: ShieldCheck,
    },
    {
      title: 'Trusted Recruitment Partner',
      description: 'Proven track record of placing top talent in leading corporate roles.',
      icon: Award,
    },
    {
      title: 'Career Guidance',
      description: 'Personalized resume refinement and interview preparation support.',
      icon: Users,
    },
    {
      title: 'Multiple Industries',
      description: 'Specialized hiring across IT, Finance, Healthcare, and Executive sectors.',
      icon: Building2,
    },
    {
      title: 'Fast Hiring Process',
      description: 'Streamlined interview scheduling and quick feedback turnarounds.',
      icon: Zap,
    },
    {
      title: 'Dedicated Support',
      description: 'Personal recruiter assigned to assist candidates throughout the journey.',
      icon: Headphones,
    },
  ];

  return (
    <div className="space-y-20 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-500/20 to-accent-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Premier Executive Recruitment Agency
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Empowering Careers. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500">
                  Building Enterprise Teams.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0">
                <strong className="text-slate-900 dark:text-white">Aarya Raakh</strong> — Connecting Talent with Opportunities. We bridge the gap between ambitious professionals and industry-leading corporate employers.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/jobs"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-ios-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  View Openings
                </Link>
                <Link
                  href="/resume-upload"
                  className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm border border-slate-300 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <FileUp className="w-4 h-4 text-brand-600" />
                  Upload Resume
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 500+ Placements
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 150+ Corporate Partners
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 98% Satisfaction
                </span>
              </div>
            </div>

            {/* Right Card / Visual Feature */}
            <div className="lg:col-span-5">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 relative shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                      AR
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white">
                        Aarya Raakh
                      </div>
                      <div className="text-xs text-slate-500">Recruitment Excellence</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    Live Hiring
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Today&apos;s Featured Match
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Senior Full Stack Developer (Next.js & Node.js)
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Mumbai (Hybrid)</span>
                    <span className="font-semibold text-brand-600">₹18-24 LPA</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-brand-500/5 border border-brand-500/10 text-center">
                    <div className="text-lg font-extrabold text-brand-600">24 Hours</div>
                    <div className="text-[11px] text-slate-500">Avg Candidate Match</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-accent-500/5 border border-accent-500/10 text-center">
                    <div className="text-lg font-extrabold text-accent-600">Top 5%</div>
                    <div className="text-[11px] text-slate-500">Screened Talent</div>
                  </div>
                </div>

                <Link
                  href="/jobs"
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition text-center flex items-center justify-center gap-2"
                >
                  Explore All Openings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="py-12 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  About Aarya Raakh
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Connecting Employers with Exceptional Talent Across Industries
                </h2>
              </div>
              <div className="lg:col-span-7 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  At <strong>Aarya Raakh</strong>, we believe that an organization&apos;s success depends fundamentally on its talent. Founded with a vision to revolutionize traditional recruitment, we specialize in identifying, vetting, and matching high-caliber professionals with premier employers across India and internationally.
                </p>
                <p>
                  Whether you are an enterprise seeking specialized senior leadership or a candidate looking to elevate your career trajectory, our dedicated recruitment consultants provide personalized, confidential, and end-to-end recruitment solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
              Why Partner With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              The Aarya Raakh Advantage
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Discover why top candidates and multinational corporations trust Aarya Raakh as their preferred recruitment partner.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUsCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1 transition duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LATEST OPENINGS SECTION */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                Explore Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                Latest Job Openings
              </h2>
            </div>

            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-md"
            >
              View All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <ContactSection />

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
