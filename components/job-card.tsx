'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { CandidateService } from '@/lib/candidate-service';
import { timeAgo } from '@/lib/utils';
import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
}

export function JobCard({ job, onApplyClick }: JobCardProps) {
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const candidate = CandidateService.getCurrentCandidate();
      if (candidate?.email) {
        const applied = await DataService.hasCandidateApplied(job.id, candidate.email);
        setAlreadyApplied(applied);
      }
    }
    checkStatus();
  }, [job.id]);

  return (
    <div className="group glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-ios-lg border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative top pill badge */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-bl-full pointer-events-none transition-all group-hover:scale-125" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            {job.employment_type}
          </span>
          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(job.created_at)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
            {job.title}
          </h3>
        </Link>

        {/* Meta Info */}
        <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-500 shrink-0" />
            <span>{job.experience}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <Link
          href={`/jobs/${job.id}`}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
        >
          View Details
        </Link>
        <button
          onClick={() => onApplyClick && onApplyClick(job)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
            alreadyApplied
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-white bg-brand-600 hover:bg-brand-700 active:scale-95'
          }`}
        >
          {alreadyApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </>
          ) : (
            <>
              Apply Now
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
