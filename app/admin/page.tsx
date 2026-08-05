'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job, Application, ResumeBankEntry, UserAccount, UserRole } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { UserService } from '@/lib/user-service';
import { StatsCard } from '@/components/admin/stats-card';
import { JobsTable } from '@/components/admin/jobs-table';
import { JobFormModal } from '@/components/admin/job-form-modal';
import { ApplicationsTable } from '@/components/admin/applications-table';
import { ResumeBankTable } from '@/components/admin/resume-bank-table';
import { UsersTable } from '@/components/admin/users-table';

import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileSearch,
  LogOut,
  Plus,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Loader2,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'jobs' | 'applications' | 'resume_bank' | 'users';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resumeBank, setResumeBank] = useState<ResumeBankEntry[]>([]);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

  // Authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = UserService.getCurrentUser();
      const legacyAdminSession = localStorage.getItem('aarya_raakh_admin_session');

      if (!currentUser && !legacyAdminSession) {
        router.push('/login');
        return;
      }

      if (currentUser && currentUser.role !== 'admin') {
        toast.error('Access denied. Admin role permission required.');
        router.push('/candidate/dashboard');
        return;
      }
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData, rbData] = await Promise.all([
        DataService.getJobs(),
        DataService.getApplications(),
        DataService.getResumeBank(),
      ]);
      const usersData = UserService.getAllUsers();
      setJobs(jobsData);
      setApplications(appsData);
      setResumeBank(rbData);
      setUsersList(usersData);
    } catch (e) {
      console.error('Error fetching admin dashboard data:', e);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    UserService.logout();
    toast.info('Logged out of Admin Portal');
    router.push('/login');
  };

  // User Roles Management Handlers
  const handleUserRoleChange = (userId: string, newRole: UserRole) => {
    const success = UserService.updateUserRole(userId, newRole);
    if (success) {
      toast.success(`User role updated to ${newRole.toUpperCase()}`);
      fetchData();
    }
  };

  const handleUserStatusToggle = (userId: string) => {
    const newStatus = UserService.toggleUserStatus(userId);
    toast.info(`User status changed to ${newStatus.toUpperCase()}`);
    fetchData();
  };

  // Job CRUD Handlers
  const handleSaveJob = async (jobData: any) => {
    try {
      if (editingJob) {
        await DataService.updateJob(editingJob.id, jobData);
        toast.success('Job updated successfully');
      } else {
        await DataService.addJob(jobData);
        toast.success('New job published successfully');
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
      fetchData();
    } catch (e) {
      toast.error('Failed to save job details');
    }
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      await DataService.toggleJobStatus(job.id);
      toast.success(`Job status changed to ${job.status === 'active' ? 'Inactive' : 'Active'}`);
      fetchData();
    } catch (e) {
      toast.error('Failed to update job status');
    }
  };

  const handleDeleteJobConfirm = async () => {
    if (!deletingJob) return;
    try {
      await DataService.deleteJob(deletingJob.id);
      toast.success('Job deleted successfully');
      setDeletingJob(null);
      fetchData();
    } catch (e) {
      toast.error('Failed to delete job');
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Aarya Raakh Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Bar Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Executive Admin Portal
            </h1>
            <p className="text-xs text-slate-500">
              Manage live job postings, user access permissions, and candidate submissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setEditingJob(null);
              setIsJobModalOpen(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Job
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'jobs', label: `Manage Jobs (${jobs.length})`, icon: Briefcase },
          { id: 'applications', label: `Applications (${applications.length})`, icon: Users },
          { id: 'resume_bank', label: `Resume Bank (${resumeBank.length})`, icon: FileSearch },
          { id: 'users', label: `Users & Permissions (${usersList.length})`, icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Jobs"
              value={jobs.length}
              subtitle="All created job positions"
              icon={Briefcase}
              colorClass="bg-blue-500/10 text-blue-600"
            />
            <StatsCard
              title="Active Openings"
              value={activeJobsCount}
              subtitle="Currently live on website"
              icon={Building2}
              colorClass="bg-emerald-500/10 text-emerald-600"
            />
            <StatsCard
              title="Job Applications"
              value={applications.length}
              subtitle="Direct candidate submissions"
              icon={Users}
              colorClass="bg-purple-500/10 text-purple-600"
            />
            <StatsCard
              title="Registered Users"
              value={usersList.length}
              subtitle="Candidates & Admin accounts"
              icon={Shield}
              colorClass="bg-amber-500/10 text-amber-600"
            />
          </div>

          {/* Recent Applications & Recent Resume Uploads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Applications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Latest Job Applications
                </h3>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View All ({applications.length}) →
                </button>
              </div>

              <div className="glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{app.name}</div>
                      <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                        {app.job_title}
                      </div>
                    </div>
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 font-semibold text-[11px]"
                    >
                      Resume
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Resume Bank Submissions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Latest Resume Bank Profiles
                </h3>
                <button
                  onClick={() => setActiveTab('resume_bank')}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View All ({resumeBank.length}) →
                </button>
              </div>

              <div className="glass-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
                {resumeBank.slice(0, 4).map((rb) => (
                  <div
                    key={rb.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{rb.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {rb.preferred_role} • {rb.experience}
                      </div>
                    </div>
                    <a
                      href={rb.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 font-semibold text-[11px]"
                    >
                      Resume
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: MANAGE JOBS */}
      {activeTab === 'jobs' && (
        <JobsTable
          jobs={jobs}
          onAddJobClick={() => {
            setEditingJob(null);
            setIsJobModalOpen(true);
          }}
          onEditJobClick={(job) => {
            setEditingJob(job);
            setIsJobModalOpen(true);
          }}
          onDeleteJobClick={(job) => setDeletingJob(job)}
          onToggleStatusClick={handleToggleStatus}
        />
      )}

      {/* TAB CONTENT 3: APPLICATIONS */}
      {activeTab === 'applications' && <ApplicationsTable applications={applications} />}

      {/* TAB CONTENT 4: RESUME BANK */}
      {activeTab === 'resume_bank' && <ResumeBankTable entries={resumeBank} />}

      {/* TAB CONTENT 5: USERS & PERMISSIONS */}
      {activeTab === 'users' && (
        <UsersTable
          users={usersList}
          onRoleChange={handleUserRoleChange}
          onStatusToggle={handleUserStatusToggle}
        />
      )}

      {/* Job Add/Edit Form Modal */}
      <JobFormModal
        job={editingJob}
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleSaveJob}
      />

      {/* Delete Confirmation Modal */}
      {deletingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Job Opening?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <strong className="text-slate-900 dark:text-white">{deletingJob.title}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingJob(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJobConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
