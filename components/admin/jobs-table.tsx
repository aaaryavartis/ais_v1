'use client';

import React, { useState } from 'react';
import { Job } from '@/lib/types';
import { Plus, Edit2, Trash2, Power, MapPin, Briefcase, IndianRupee } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface JobsTableProps {
  jobs: Job[];
  onAddJobClick: () => void;
  onEditJobClick: (job: Job) => void;
  onDeleteJobClick: (job: Job) => void;
  onToggleStatusClick: (job: Job) => void;
}

export function JobsTable({
  jobs,
  onAddJobClick,
  onEditJobClick,
  onDeleteJobClick,
  onToggleStatusClick,
}: JobsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search jobs by title or location..."
          className="w-full sm:w-72 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
        />

        <button
          onClick={onAddJobClick}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Job
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <th className="p-4">Job Title</th>
                <th className="p-4">Location</th>
                <th className="p-4">Experience</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Posted Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80 text-xs">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No jobs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    
                    {/* Title */}
                    <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {job.title}
                    </td>

                    {/* Location */}
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        {job.location}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                        {job.experience}
                      </span>
                    </td>

                    {/* Employment Type */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {job.employment_type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          job.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>

                    {/* Posted Date */}
                    <td className="p-4 text-slate-500">
                      {formatDate(job.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Toggle Active/Deactivate */}
                        <button
                          onClick={() => onToggleStatusClick(job)}
                          className={`p-1.5 rounded-lg transition ${
                            job.status === 'active'
                              ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          }`}
                          title={job.status === 'active' ? 'Deactivate Job' : 'Activate Job'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEditJobClick(job)}
                          className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition"
                          title="Edit Job"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteJobClick(job)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
