'use client';

import React, { useEffect, useState } from 'react';
import { Job, JobFilters } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { JobCard } from '@/components/job-card';
import { ApplyModal } from '@/components/apply-modal';
import { Search, Filter, RotateCcw, Briefcase } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<JobFilters>({
    query: '',
    location: 'all',
    experience: 'all',
    employmentType: 'all',
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const data = await DataService.getActiveJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (e) {
        console.error('Error fetching jobs:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.location !== 'all') {
      result = result.filter((j) =>
        j.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.experience !== 'all') {
      result = result.filter((j) =>
        j.experience.toLowerCase().includes(filters.experience.toLowerCase())
      );
    }

    if (filters.employmentType !== 'all') {
      result = result.filter((j) => j.employment_type === filters.employmentType);
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  const handleResetFilters = () => {
    setFilters({
      query: '',
      location: 'all',
      experience: 'all',
      employmentType: 'all',
    });
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          Career Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Current Job Openings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Discover verified roles across top corporate organizations partnered with Aaryavart integrated services.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            placeholder="Search by job title, key skills (e.g. Next.js, Figma, Python), or keywords..."
            className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          
          {/* Location Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Locations</option>
              <option value="mumbai">Mumbai</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="pune">Pune</option>
              <option value="delhi">Delhi NCR</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Experience Level
            </label>
            <select
              value={filters.experience}
              onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Experience Levels</option>
              <option value="3+">3+ Years</option>
              <option value="4+">4+ Years</option>
              <option value="5+">5+ Years</option>
              <option value="6+">6+ Years</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Employment Type
            </label>
            <select
              value={filters.employmentType}
              onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-brand-600" />
          Showing <span className="text-slate-900 dark:text-white font-extrabold">{filteredJobs.length}</span> Job Openings
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Jobs Found</h3>
          <p className="text-xs text-slate-500">
            No active positions match your current search filters. Try resetting filters or submit your resume to our general talent bank.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full bg-brand-600 text-white font-bold text-xs shadow"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onApplyClick={handleApplyClick} />
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
