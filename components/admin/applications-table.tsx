'use client';

import React, { useState } from 'react';
import { Application } from '@/lib/types';
import { Search, Download, ExternalLink, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ApplicationsTableProps {
  applications: Application[];
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      (app.job_title && app.job_title.toLowerCase().includes(q)) ||
      app.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by candidate name, job title, or email..."
          className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <th className="p-4">Candidate</th>
                <th className="p-4">Applied Position</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Experience & Edu</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4 text-right">Resume File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No applications received yet.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    
                    {/* Candidate */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {app.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{app.location}</div>
                      {app.linkedin && (
                        <a
                          href={app.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          LinkedIn Profile <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>

                    {/* Applied Job */}
                    <td className="p-4 font-semibold text-brand-600 dark:text-brand-400 max-w-xs truncate">
                      {app.job_title || 'Position Applied'}
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 space-y-1 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{app.phone}</span>
                      </div>
                    </td>

                    {/* Experience & Edu */}
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="font-semibold">{app.experience}</div>
                      <div className="text-[11px] text-slate-400">{app.qualification}</div>
                    </td>

                    {/* Applied Date */}
                    <td className="p-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(app.created_at)}
                      </span>
                    </td>

                    {/* Download Resume Button */}
                    <td className="p-4 text-right">
                      <a
                        href={app.resume_url}
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
