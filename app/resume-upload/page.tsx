'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DataService } from '@/lib/data-service';
import { FileUp, Upload, CheckCircle2, FileText, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const resumeBankSchema = z.object({
  name: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Current location is required'),
  qualification: z.string().min(2, 'Highest Qualification is required'),
  experience: z.string().min(1, 'Please specify your experience'),
  preferred_role: z.string().min(2, 'Preferred Job Role is required'),
  preferred_location: z.string().min(2, 'Preferred Location is required'),
  skills: z.string().min(2, 'Skills are required (comma separated)'),
  notes: z.string().optional(),
});

type ResumeBankFormValues = z.infer<typeof resumeBankSchema>;

export default function ResumeUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResumeBankFormValues>({
    resolver: zodResolver(resumeBankSchema),
  });

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

  const onSubmit = async (data: ResumeBankFormValues) => {
    if (!selectedFile) {
      setFileError('Please upload your resume file (PDF/DOC/DOCX)');
      return;
    }

    try {
      setIsSubmitting(true);
      const resumeUrl = await DataService.uploadResume(selectedFile);

      const formattedSkills = data.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await DataService.submitToResumeBank({
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        qualification: data.qualification,
        experience: data.experience,
        preferred_role: data.preferred_role,
        preferred_location: data.preferred_location,
        skills: formattedSkills,
        notes: data.notes || '',
        resume_url: resumeUrl,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Your profile has been saved to the Resume Bank!');
    } catch (err) {
      setIsSubmitting(false);
      toast.error('Submission failed. Please try again.');
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setFileError(null);
    setIsSubmitted(false);
  };

  return (
    <div className="py-12 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          Candidate Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Join Aaryavart Integrated Services Candidate Resume Bank
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t see a matching position today? Upload your resume so our executive recruiters can match you with upcoming enterprise opportunities.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800">
        {isSubmitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Your profile & resume have been registered successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Our talent acquisition team at Aaryavart Integrated Services will index your skills and contact you as soon as a suitable opening matching your preferred role arises.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
              >
                Submit Another Resume Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="flex items-center gap-2 pb-4 border-b border-slate-200/60 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Candidate Profile & Qualifications
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g. Priya Deshmukh"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="priya@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number *
                </label>
                <input
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Current Location */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Location *
                </label>
                <input
                  {...register('location')}
                  placeholder="e.g. Pune, MH"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Highest Qualification */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Highest Qualification *
                </label>
                <input
                  {...register('qualification')}
                  placeholder="e.g. M.Tech / MBA / B.Com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.qualification && <p className="text-[11px] text-rose-500 mt-1">{errors.qualification.message}</p>}
              </div>

              {/* Total Experience */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Total Experience *
                </label>
                <input
                  {...register('experience')}
                  placeholder="e.g. 5 Years"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.experience && <p className="text-[11px] text-rose-500 mt-1">{errors.experience.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Job Role */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Job Role *
                </label>
                <input
                  {...register('preferred_role')}
                  placeholder="e.g. Senior Frontend Architect / Product Manager"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.preferred_role && <p className="text-[11px] text-rose-500 mt-1">{errors.preferred_role.message}</p>}
              </div>

              {/* Preferred Location */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Location *
                </label>
                <input
                  {...register('preferred_location')}
                  placeholder="e.g. Mumbai / Bengaluru / Remote"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                />
                {errors.preferred_location && <p className="text-[11px] text-rose-500 mt-1">{errors.preferred_location.message}</p>}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Skills & Technical Expertise (Comma separated) *
              </label>
              <input
                {...register('skills')}
                placeholder="e.g. React, Node.js, AWS, Financial Modeling, Executive Recruitment"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
              {errors.skills && <p className="text-[11px] text-rose-500 mt-1">{errors.skills.message}</p>}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Additional Notes / Career Expectations (Optional)
              </label>
              <textarea
                rows={3}
                {...register('notes')}
                placeholder="Mention expected CTC, notice period, or specific industry preferences..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Upload Resume Document (PDF, DOC, DOCX - Max 10MB) *
              </label>
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-brand-500 transition bg-slate-50/50 dark:bg-slate-800/40">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    <FileText className="w-6 h-6" />
                    <span className="truncate max-w-sm">{selectedFile.name}</span>
                    <span className="text-[11px] text-slate-400">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      Click to upload or drag & drop resume file
                    </p>
                    <p className="text-[11px] text-slate-400">PDF, DOC, or DOCX formats accepted</p>
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading & Saving Resume Profile...
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    Register Profile in Resume Bank
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
