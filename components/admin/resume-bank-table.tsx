'use client';

import React, { useState } from 'react';
import { ResumeBankEntry } from '@/lib/types';
import { Search, Download, Mail, Phone, Calendar, Sparkles, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ResumeBankTableProps {
  entries: ResumeBankEntry[];
}

export function ResumeBankTable({ entries }: ResumeBankTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredEntries = entries.filter((entry) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      entry.name.toLowerCase().includes(q) ||
      entry.skills.some((s) => s.toLowerCase().includes(q)) ||
      entry.preferred_role.toLowerCase().includes(q) ||
      entry.preferred_location.toLowerCase().includes(q);

    const matchRole = !roleFilter || entry.preferred_role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchLocation = !locationFilter || entry.preferred_location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchSearch && matchRole && matchLocation;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skill, candidate name, or role..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Filter by Preferred Role */}
        <input
          type="text"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          placeholder="Filter by Preferred Role..."
          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
        />

        {/* Filter by Preferred Location */}
        <input
          type="text"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          placeholder="Filter by Preferred Location..."
          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <th className="p-4">Candidate</th>
                <th className="p-4">Preferred Role & Location</th>
                <th className="p-4">Experience & Edu</th>
                <th className="p-4">Skills</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 text-right">Resume File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80 text-xs">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No candidates found in Resume Bank.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    
                    {/* Candidate */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {entry.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {entry.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {entry.phone}
                        </span>
                      </div>
                    </td>

                    {/* Preferred Role & Location */}
                    <td className="p-4">
                      <div className="font-semibold text-brand-600 dark:text-brand-400">
                        {entry.preferred_role}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {entry.preferred_location}
                      </div>
                    </td>

                    {/* Experience & Edu */}
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold">{entry.experience}</div>
                      <div className="text-[11px] text-slate-400">{entry.qualification}</div>
                    </td>

                    {/* Skills */}
                    <td className="p-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {entry.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Submitted Date */}
                    <td className="p-4 text-slate-500">
                      {formatDate(entry.created_at)}
                    </td>

                    {/* Download Resume Button */}
                    <td className="p-4 text-right">
                      <a
                        href={entry.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs transition border border-brand-500/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Resume
                      </a>
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
