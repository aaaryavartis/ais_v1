import React from 'react';
import { ContactMessage } from '@/lib/types';
import { format } from 'date-fns';
import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react';

export function ContactMessagesTable({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          No Messages Yet
        </h3>
        <p className="text-slate-500 max-w-sm mx-auto text-sm">
          When candidates or clients reach out via the Contact Us form, their messages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">Sender</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4 whitespace-nowrap">Date Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {messages.map((msg) => (
              <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="px-6 py-4 align-top">
                  <div className="font-bold text-slate-900 dark:text-white">{msg.name}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    <a href={`mailto:${msg.email}`} className="hover:text-brand-600 transition">
                      {msg.email}
                    </a>
                  </div>
                  {msg.phone && (
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      <a href={`tel:${msg.phone}`} className="hover:text-brand-600 transition">
                        {msg.phone}
                      </a>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 align-top">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {msg.subject || 'No Subject'}
                  </span>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="text-slate-600 dark:text-slate-400 max-w-md whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </td>
                <td className="px-6 py-4 align-top whitespace-nowrap text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(msg.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs mt-1 ml-5">
                    {format(new Date(msg.created_at), 'h:mm a')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
