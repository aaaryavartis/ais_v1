'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, CandidateUser } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { CandidateService } from '@/lib/candidate-service';
import { X, Upload, CheckCircle2, FileText, Loader2, AlertCircle, Zap, ShieldCheck, UserCheck, AlertTriangle, LogIn, UserPlus, Lock } from 'lucide-react';
import { toast } from 'sonner';

const applySchema = z.object({
  name: z.string().min(2, 'Full Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Current Location is required'),
  experience: z.string().min(1, 'Please specify your experience'),
  qualification: z.string().min(2, 'Highest Qualification is required'),
  linkedin: z.string().optional(),
});

type ApplyFormValues = z.infer<typeof applySchema>;

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyModal({ job, isOpen, onClose }: ApplyModalProps) {
  const router = useRouter();
  const [candidate, setCandidate] = useState<CandidateUser | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState<boolean>(false);
  const [checkingApplied, setCheckingApplied] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [useOneClick, setUseOneClick] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
  });

  const watchEmail = watch('email');

  useEffect(() => {
    async function checkDuplicate() {
      if (isOpen && job) {
        const loggedInCand = CandidateService.getCurrentCandidate();
        setCandidate(loggedInCand);
        setAlreadyApplied(false);
        setCheckingApplied(true);

        const activeEmail = loggedInCand?.email || watchEmail;
        if (activeEmail) {
          const applied = await DataService.hasCandidateApplied(job.id, activeEmail);
          setAlreadyApplied(applied);
        }

        if (loggedInCand) {
          setValue('name', loggedInCand.name);
          setValue('email', loggedInCand.email);
          setValue('phone', loggedInCand.phone || '');
          setValue('location', loggedInCand.location || '');
          setValue('experience', loggedInCand.experience || '');
          setValue('qualification', loggedInCand.qualification || '');
          setValue('linkedin', loggedInCand.linkedin || '');
        }

        setCheckingApplied(false);
      }
    }

    checkDuplicate();
  }, [isOpen, job, setValue, watchEmail]);

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10 MB limit');
      setSelectedFile(null);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      setFileError('Only PDF, DOC, and DOCX files are allowed');
      setSelectedFile(null);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
  };

  const handleOneClickApply = async () => {
    if (!candidate) return;
    if (alreadyApplied) {
      toast.error('You have already applied for this job opening!');
      return;
    }

    try {
      setIsSubmitting(true);
      let resumeUrl = candidate.resume_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

      if (selectedFile) {
        resumeUrl = await DataService.uploadResume(selectedFile);
      }

      await DataService.submitApplication({
        job_id: job.id,
        job_title: job.title,
        candidate_id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || '',
        location: candidate.location || '',
        experience: candidate.experience || '',
        qualification: candidate.qualification || '',
        linkedin: candidate.linkedin || '',
        resume_url: resumeUrl,
        status: 'Submitted',
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setAlreadyApplied(true);
      toast.success('One-Click Application submitted successfully!');
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || 'Application failed. Please try again.');
    }
  };

  const onSubmitForm = async (data: ApplyFormValues) => {
    if (alreadyApplied) {
      toast.error('You have already applied for this job opening!');
      return;
    }

    let resumeUrl = candidate?.resume_url || '';

    if (selectedFile) {
      resumeUrl = await DataService.uploadResume(selectedFile);
    } else if (!resumeUrl) {
      setFileError('Please upload your resume file (PDF/DOC/DOCX)');
      return;
    }

    try {
      setIsSubmitting(true);
      await DataService.submitApplication({
        job_id: job.id,
        job_title: job.title,
        candidate_id: candidate?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        experience: data.experience,
        qualification: data.qualification,
        linkedin: data.linkedin || '',
        resume_url: resumeUrl,
        status: 'Submitted',
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setAlreadyApplied(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(err.message || 'Submission failed. Please try again.');
    }
  };

  const handleModalClose = () => {
    reset();
    setSelectedFile(null);
    setFileError(null);
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── NOT LOGGED IN: Force login/register prompt ── */}
        {!candidate ? (
          <div className="py-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-brand-500/10 border-2 border-brand-500/30 flex items-center justify-center">
              <Lock className="w-9 h-9 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Login Required to Apply
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You need to be logged in to apply for{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-200">{job?.title}</span>.
                {' '}Sign in or create a free account to continue.
              </p>
            </div>

            <div className="w-full space-y-3 pt-2">
              <Link
                href={`/login?redirect=/`}
                onClick={handleModalClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Your Account
              </Link>
              <Link
                href={`/register?redirect=/`}
                onClick={handleModalClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-brand-500/40 hover:border-brand-500 hover:bg-brand-500/5 text-brand-600 dark:text-brand-400 font-bold text-sm transition"
              >
                <UserPlus className="w-4 h-4" />
                Create a Free Account
              </Link>
            </div>

            <p className="text-[11px] text-slate-400">
              Already have an account?{' '}
              <Link href="/login" onClick={handleModalClose} className="text-brand-600 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        ) : isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Your application has been submitted successfully.
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Thank you for applying for <span className="font-semibold text-brand-600">{job.title}</span>. Track application status in your <Link href="/candidate/dashboard" className="text-brand-600 font-bold underline">Candidate Dashboard</Link>.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Link
                href="/candidate/dashboard"
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-full bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition"
              >
                View My Applications
              </Link>
              <button
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Direct Application
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-1">
                {job.title}
              </h2>
              <p className="text-xs text-slate-500">{job.location} • {job.experience}</p>
            </div>

            {/* DUPLICATE APPLICATION WARNING BANNER */}
            {alreadyApplied && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">You Have Already Applied to This Position</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Our database shows you already submitted an application for <strong className="text-slate-900 dark:text-white">{job.title}</strong>. Duplicate applications for the same opening are disabled to ensure fair processing.
                  </p>
                  <Link
                    href="/candidate/dashboard"
                    onClick={handleModalClose}
                    className="inline-block mt-2 font-bold text-brand-600 hover:underline text-[11px]"
                  >
                    View Application Status in Candidate Dashboard →
                  </Link>
                </div>
              </div>
            )}

            {/* Candidate Logged In - One Click Fast Apply View */}
            {candidate && useOneClick ? (
              <div className="space-y-6">
                
                {/* One Click Banner */}
                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-slate-900 dark:text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        One-Click Quick Apply Active
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Logged In
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-brand-500/20">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Candidate Name</span>
                      <strong className="text-slate-900 dark:text-white">{candidate.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <strong className="text-slate-900 dark:text-white truncate block">{candidate.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Experience & Edu</span>
                      <strong className="text-slate-900 dark:text-white">{candidate.experience} • {candidate.qualification}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Saved Resume</span>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold truncate block">
                        Saved Resume Attached
                      </span>
                    </div>
                  </div>
                </div>

                {!alreadyApplied && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Optionally Upload a Custom Resume for this Job:
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {selectedFile && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleOneClickApply}
                    disabled={isSubmitting || alreadyApplied}
                    className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {alreadyApplied ? (
                      'Already Applied to this Position'
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Submit Application Now (1-Click)
                      </>
                    )}
                  </button>

                  {!alreadyApplied && (
                    <button
                      onClick={() => setUseOneClick(false)}
                      className="w-full text-center text-[11px] text-slate-500 hover:underline"
                    >
                      Edit details manually before submitting →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Manual Form View */
              <div>
                {!candidate && (
                  <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Log in to auto-fill details & prevent duplicate applications!</span>
                    </div>
                    <Link
                      href="/login"
                      className="px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-[11px] shrink-0"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        {...register('phone')}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Current Location *
                      </label>
                      <input
                        {...register('location')}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                      {errors.location && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Total Experience *
                      </label>
                      <input
                        {...register('experience')}
                        placeholder="e.g. 4 Years"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                      {errors.experience && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.experience.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Highest Qualification *
                      </label>
                      <input
                        {...register('qualification')}
                        placeholder="e.g. B.Tech / MBA / B.Sc"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                      />
                      {errors.qualification && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.qualification.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      LinkedIn Profile (Optional)
                    </label>
                    <input
                      {...register('linkedin')}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Upload Resume (PDF, DOC, DOCX - Max 10MB) *
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-brand-500 transition bg-slate-50/50 dark:bg-slate-800/40">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                          <FileText className="w-5 h-5" />
                          <span className="truncate max-w-xs">{selectedFile.name}</span>
                          <span className="text-[10px] text-slate-400">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            Click or drag file to upload
                          </p>
                          <p className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      )}
                    </div>
                    {fileError && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fileError}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || alreadyApplied}
                      className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {alreadyApplied ? (
                        'Already Applied to this Position'
                      ) : isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
