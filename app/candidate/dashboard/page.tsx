'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CandidateUser, Application } from '@/lib/types';
import { CandidateService } from '@/lib/candidate-service';
import { DataService } from '@/lib/data-service';
import { formatDate } from '@/lib/utils';
import {
  UserCheck,
  Briefcase,
  User,
  LogOut,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Edit,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CandidateDashboardPage() {
  const router = useRouter();

  const [candidate, setCandidate] = useState<CandidateUser | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'applied_jobs' | 'profile'>('applied_jobs');
  const [loading, setLoading] = useState(true);

  // Edit Profile Form state
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const current = await CandidateService.getCurrentCandidate();
      if (!current) {
        router.push('/candidate/login');
        return;
      }
      setCandidate(current);
      setPhone(current.phone || '');
      setLocation(current.location || '');
      setQualification(current.qualification || '');
      setExperience(current.experience || '');
      setLinkedin(current.linkedin || '');

      fetchApplications();
    };
    checkAuth();
  }, [router]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const apps = await CandidateService.getMyAppliedJobs();
      setAppliedJobs(apps);
    } catch (e) {
      console.error('Failed to load applied jobs:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    CandidateService.logoutCandidate();
    toast.info('Logged out of Candidate Portal');
    router.push('/candidate/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await CandidateService.updateProfile({
        phone,
        location,
        qualification,
        experience,
        linkedin,
      });
      if (updated) {
        setCandidate(updated);
        toast.success('Candidate profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
    setSavingProfile(false);
  };

  if (loading && !candidate) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading Candidate Portal...</p>
      </div>
    );
  }

  return (
    <div className="py-8 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {candidate?.name ? candidate.name.substring(0, 2).toUpperCase() : 'CA'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {candidate?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-slate-500">{candidate?.email} • {candidate?.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            Explore More Jobs
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('applied_jobs')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'applied_jobs'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          My Applied Jobs ({appliedJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <User className="w-4 h-4" />
          My Profile & Resume
        </button>
      </div>

      {/* TAB 1: MY APPLIED JOBS */}
      {activeTab === 'applied_jobs' && (
        <div className="space-y-4 animate-fadeIn">
          {appliedJobs.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Applied Jobs Yet</h3>
              <p className="text-xs text-slate-500">
                You haven&apos;t submitted applications to any openings yet. Browse current positions and apply in 1-click!
              </p>
              <Link
                href="/jobs"
                className="inline-block px-6 py-2.5 rounded-full bg-brand-600 text-white text-xs font-bold shadow-md"
              >
                Browse Job Directory
              </Link>
            </div>
          ) : (
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                      <th className="p-4">Applied Position</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80">
                    {appliedJobs.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {app.job_title || 'Position Applied'}
                          </div>
                          <div className="text-[11px] text-slate-400">{app.location}</div>
                        </td>
                        <td className="p-4 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(app.created_at)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {app.status || 'Submitted'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]"
                          >
                            View Resume <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY PROFILE & RESUME */}
      {activeTab === 'profile' && candidate && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 animate-fadeIn">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Candidate Details (Auto-filled during One-Click Apply)
              </h3>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Quick Apply Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Current Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Highest Qualification</label>
                <input
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Total Experience</label>
                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">LinkedIn URL</label>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={candidate.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-4 h-4" /> Download Current Resume File
              </a>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
