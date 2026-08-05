'use client';

import React, { useState } from 'react';
import { UserAccount, UserRole } from '@/lib/types';
import { Search, Shield, UserCheck, ShieldCheck, UserX, Power, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface UsersTableProps {
  users: UserAccount[];
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onStatusToggle: (userId: string) => void;
}

export function UsersTable({ users, onRoleChange, onStatusToggle }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins Only</option>
          <option value="candidate">Candidates Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                <th className="p-4">User</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Profile Info</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Role & Access Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No users found matching filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    
                    {/* User */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                          user.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3 h-3" /> Admin
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3" /> Candidate
                          </>
                        )}
                      </span>
                    </td>

                    {/* Profile Info */}
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {user.experience ? (
                        <div>
                          <div className="font-semibold">{user.preferred_role || user.experience}</div>
                          <div className="text-[11px] text-slate-400">{user.qualification} • {user.location}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">System Account</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(user.created_at)}
                      </span>
                    </td>

                    {/* Role & Access Actions */}
                    <td className="p-4 text-right space-x-2">
                      {/* Role Toggle Button */}
                      <button
                        onClick={() => onRoleChange(user.id, user.role === 'admin' ? 'candidate' : 'admin')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition border ${
                          user.role === 'admin'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                            : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30'
                        }`}
                      >
                        {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>

                      {/* Block/Unblock Button */}
                      <button
                        onClick={() => onStatusToggle(user.id)}
                        className={`p-1.5 rounded-xl transition ${
                          user.status === 'active'
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
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
