import { CandidateUser, Application } from './types';
import { DataService } from './data-service';

const CANDIDATE_STORAGE_KEYS = {
  CURRENT_USER: 'aarya_raakh_candidate_session_v1',
  USERS_LIST: 'aarya_raakh_candidate_users_v1',
  RESET_TOKENS: 'aarya_raakh_reset_tokens_v1',
};

interface ResetToken {
  token: string;
  email: string;
  expiresAt: number; // Unix ms timestamp
}

const DEFAULT_DEMO_CANDIDATE: CandidateUser = {
  id: 'cand-demo-1',
  name: 'Rahul Sharma',
  email: 'candidate@example.com',
  role: 'candidate',
  status: 'active',
  phone: '+91 98765 43210',
  location: 'Mumbai, Maharashtra',
  qualification: 'B.Tech in Computer Science',
  experience: '4 Years',
  linkedin: 'https://linkedin.com/in/rahul-sharma-demo',
  resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  created_at: new Date().toISOString(),
};

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

export const CandidateService = {
  getCurrentCandidate(): CandidateUser | null {
    return getLocal<CandidateUser | null>(CANDIDATE_STORAGE_KEYS.CURRENT_USER, null);
  },

  isLoggedIn(): boolean {
    const candidate = this.getCurrentCandidate();
    return Boolean(candidate && candidate.id && candidate.email);
  },

  loginCandidate(email: string): CandidateUser {
    const users = getLocal<CandidateUser[]>(CANDIDATE_STORAGE_KEYS.USERS_LIST, [DEFAULT_DEMO_CANDIDATE]);
    let candidate = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!candidate) {
      // Auto-create candidate profile for demo login if email matches demo
      candidate = {
        ...DEFAULT_DEMO_CANDIDATE,
        email: email,
        name: email.split('@')[0].replace('.', ' '),
      };
      users.push(candidate);
      setLocal(CANDIDATE_STORAGE_KEYS.USERS_LIST, users);
    }

    setLocal(CANDIDATE_STORAGE_KEYS.CURRENT_USER, candidate);
    return candidate;
  },

  registerCandidate(data: Omit<CandidateUser, 'id' | 'created_at' | 'role' | 'status'>): CandidateUser {
    const users = getLocal<CandidateUser[]>(CANDIDATE_STORAGE_KEYS.USERS_LIST, [DEFAULT_DEMO_CANDIDATE]);
    
    // Check if email already registered
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      const updated = { ...existing, ...data };
      const idx = users.findIndex((u) => u.id === existing.id);
      users[idx] = updated;
      setLocal(CANDIDATE_STORAGE_KEYS.USERS_LIST, users);
      setLocal(CANDIDATE_STORAGE_KEYS.CURRENT_USER, updated);
      return updated;
    }

    const newCandidate: CandidateUser = {
      ...data,
      role: 'candidate',
      status: 'active',
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'cand-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    users.push(newCandidate);
    setLocal(CANDIDATE_STORAGE_KEYS.USERS_LIST, users);
    setLocal(CANDIDATE_STORAGE_KEYS.CURRENT_USER, newCandidate);
    return newCandidate;
  },

  updateProfile(updates: Partial<CandidateUser>): CandidateUser | null {
    const current = this.getCurrentCandidate();
    if (!current) return null;

    const updated = { ...current, ...updates };
    setLocal(CANDIDATE_STORAGE_KEYS.CURRENT_USER, updated);

    const users = getLocal<CandidateUser[]>(CANDIDATE_STORAGE_KEYS.USERS_LIST, [DEFAULT_DEMO_CANDIDATE]);
    const idx = users.findIndex((u) => u.email === current.email);
    if (idx !== -1) {
      users[idx] = updated;
      setLocal(CANDIDATE_STORAGE_KEYS.USERS_LIST, users);
    }

    return updated;
  },

  logoutCandidate(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CANDIDATE_STORAGE_KEYS.CURRENT_USER);
  },

  async getMyAppliedJobs(): Promise<Application[]> {
    const current = this.getCurrentCandidate();
    if (!current) return [];
    const allApps = await DataService.getApplications();
    return allApps.filter((a) => a.email.toLowerCase() === current.email.toLowerCase());
  },

  // ── Password Reset ──────────────────────────────────────────────

  generateResetToken(email: string): string | null {
    const users = getLocal<CandidateUser[]>(CANDIDATE_STORAGE_KEYS.USERS_LIST, []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null; // email not registered

    const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const tokens = getLocal<ResetToken[]>(CANDIDATE_STORAGE_KEYS.RESET_TOKENS, []);
    // Remove any old token for this email
    const filtered = tokens.filter((t) => t.email.toLowerCase() !== email.toLowerCase());
    filtered.push({ token, email: user.email, expiresAt: Date.now() + 15 * 60 * 1000 }); // 15 min
    setLocal(CANDIDATE_STORAGE_KEYS.RESET_TOKENS, filtered);
    return token;
  },

  verifyResetToken(token: string): string | null {
    const tokens = getLocal<ResetToken[]>(CANDIDATE_STORAGE_KEYS.RESET_TOKENS, []);
    const entry = tokens.find((t) => t.token === token);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) return null; // expired
    return entry.email;
  },

  resetPassword(token: string, newPassword: string): boolean {
    const email = this.verifyResetToken(token);
    if (!email) return false;

    // In this localStorage-based auth, we store password hash (plain for demo)
    const users = getLocal<CandidateUser[]>(CANDIDATE_STORAGE_KEYS.USERS_LIST, []);
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return false;

    // Store the new password (in real Supabase this would call supabase.auth.updateUser)
    (users[idx] as any).password = newPassword;
    setLocal(CANDIDATE_STORAGE_KEYS.USERS_LIST, users);

    // Invalidate the token
    const tokens = getLocal<ResetToken[]>(CANDIDATE_STORAGE_KEYS.RESET_TOKENS, []);
    setLocal(CANDIDATE_STORAGE_KEYS.RESET_TOKENS, tokens.filter((t) => t.token !== token));
    return true;
  },
};
