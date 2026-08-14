'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { ApplyModal } from '@/components/apply-modal';
import { timeAgo, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  CheckCircle2,
  Share2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return;
      try {
        const data = await DataService.getJobById(jobId);
        setJob(data);
      } catch (e) {
        console.error('Failed to load job details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="h-96 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Position Not Found</h2>
        <p className="text-xs text-slate-500">The requested position may have expired or been deactivated.</p>
        <Link
          href="/jobs"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-600 text-white font-bold text-xs"
        >
          Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job Directory
      </Link>

      {/* Main Glass Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                {job.employment_type}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Posted {timeAgo(job.created_at)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {job.title}
            </h1>
            <p className="text-xs text-slate-500">Aaryavart Integrated Services Recruitment Partner Placement</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="p-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Share Job"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="flex-1 sm:flex-initial px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Quick Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Location</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              {job.location}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Experience</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              {job.experience}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Salary Offer</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5 shrink-0" />
              {job.salary}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Posted On</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
              {formatDate(job.created_at)}
            </span>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Position Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Responsibilities
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Required Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Apply CTA Box */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-600/10 to-accent-500/10 border border-brand-500/20">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Interested in this position?
            </h4>
            <p className="text-xs text-slate-500">
              Submit your resume directly to our recruitment team for fast-track evaluation.
            </p>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg transition"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
