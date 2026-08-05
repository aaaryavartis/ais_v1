'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Job, EmploymentType, JobStatus } from '@/lib/types';
import { X, Loader2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  location: z.string().min(2, 'Location is required'),
  experience: z.string().min(1, 'Experience is required'),
  salary: z.string().min(1, 'Salary is required'),
  employment_type: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote']),
  status: z.enum(['active', 'inactive']),
  skills: z.string().min(2, 'Provide skills separated by commas'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters (comma or line separated)'),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormModalProps {
  job?: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function JobFormModal({ job, isOpen, onClose, onSubmit }: JobFormModalProps) {
  const isEditing = Boolean(job);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      employment_type: 'Full-time',
      status: 'active',
    },
  });

  useEffect(() => {
    if (job) {
      setValue('title', job.title);
      setValue('location', job.location);
      setValue('experience', job.experience);
      setValue('salary', job.salary);
      setValue('employment_type', job.employment_type);
      setValue('status', job.status);
      setValue('skills', job.skills.join(', '));
      setValue('description', job.description);
      setValue('responsibilities', job.responsibilities.join('\n'));
    } else {
      reset({
        title: '',
        location: '',
        experience: '',
        salary: '',
        employment_type: 'Full-time',
        status: 'active',
        skills: '',
        description: '',
        responsibilities: '',
      });
    }
  }, [job, isOpen, setValue, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: JobFormValues) => {
    const formattedSkills = data.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const formattedResponsibilities = data.responsibilities
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    await onSubmit({
      ...data,
      skills: formattedSkills,
      responsibilities: formattedResponsibilities,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Job Posting' : 'Add New Job Opening'}
            </h3>
            <p className="text-xs text-slate-500">
              Save directly to Supabase database & make visible to candidates
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {/* Job Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Job Title *
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Location *
              </label>
              <input
                {...register('location')}
                placeholder="e.g. Mumbai / Hybrid / Remote"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
              {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location.message}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Experience *
              </label>
              <input
                {...register('experience')}
                placeholder="e.g. 4+ Years"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
              {errors.experience && <p className="text-[11px] text-rose-500 mt-1">{errors.experience.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Salary */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Salary Range *
              </label>
              <input
                {...register('salary')}
                placeholder="e.g. ₹15,00,000 - ₹20,00,000 P.A."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              />
              {errors.salary && <p className="text-[11px] text-rose-500 mt-1">{errors.salary.message}</p>}
            </div>

            {/* Employment Type */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Employment Type
              </label>
              <select
                {...register('employment_type')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Posting Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Skills Required (Comma separated) *
            </label>
            <input
              {...register('skills')}
              placeholder="e.g. React, TypeScript, Next.js, Node.js, SQL"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
            {errors.skills && <p className="text-[11px] text-rose-500 mt-1">{errors.skills.message}</p>}
          </div>

          {/* Job Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Job Description *
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Comprehensive summary of the role and candidate expectations..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
            {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description.message}</p>}
          </div>

          {/* Responsibilities */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Key Responsibilities (One item per line) *
            </label>
            <textarea
              rows={3}
              {...register('responsibilities')}
              placeholder="Architect scalable web applications&#10;Lead technical code reviews&#10;Collaborate with cross-functional teams"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
            {errors.responsibilities && <p className="text-[11px] text-rose-500 mt-1">{errors.responsibilities.message}</p>}
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Update Job'
              ) : (
                'Publish Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
