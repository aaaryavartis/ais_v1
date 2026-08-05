import { UserAccount, UserRole, UserStatus } from './types';
import { DataService } from './data-service';

const USER_STORAGE_KEYS = {
  CURRENT_SESSION: 'aarya_raakh_unified_user_session_v1',
  USERS_LIST: 'aarya_raakh_users_db_v1',
};

const INITIAL_DEMO_USERS: UserAccount[] = [
  {
    id: 'user-admin-1',
    name: 'Aarya Admin',
    email: 'admin@aaryaraakh.com',
    role: 'admin',
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'user-cand-1',
    name: 'Rahul Sharma',
    email: 'candidate@example.com',
    role: 'candidate',
    status: 'active',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    qualification: 'B.Tech in Computer Science',
    experience: '4 Years',
    preferred_role: 'Senior Full Stack Developer',
    preferred_location: 'Mumbai / Hybrid',
    skills: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    linkedin: 'https://linkedin.com/in/rahul-sharma-demo',
    resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

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
    console.error('LocalStorage write error:', e);
  }
}

export const UserService = {
  getAllUsers(): UserAccount[] {
    return getLocal<UserAccount[]>(USER_STORAGE_KEYS.USERS_LIST, INITIAL_DEMO_USERS);
  },

  getCurrentUser(): UserAccount | null {
    return getLocal<UserAccount | null>(USER_STORAGE_KEYS.CURRENT_SESSION, null);
  },

  login(email: string): UserAccount | null {
    const users = this.getAllUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // If logging in with admin email for first time
      if (email.toLowerCase() === 'admin@aaryaraakh.com') {
        user = INITIAL_DEMO_USERS[0];
      } else {
        // Auto-create candidate account
        user = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0].replace('.', ' '),
          email: email,
          role: 'candidate',
          status: 'active',
          created_at: new Date().toISOString(),
        };
        users.push(user);
        setLocal(USER_STORAGE_KEYS.USERS_LIST, users);
      }
    }

    if (user.status === 'blocked') {
      throw new Error('Your account has been suspended by the administrator.');
    }

    setLocal(USER_STORAGE_KEYS.CURRENT_SESSION, user);
    // Legacy session support for admin/candidate pages
    if (user.role === 'admin') {
      localStorage.setItem('aarya_raakh_admin_session', 'true');
    }
    localStorage.setItem('aarya_raakh_candidate_session_v1', JSON.stringify(user));

    return user;
  },

  registerCandidate(data: {
    name: string;
    email: string;
    phone: string;
    location: string;
    qualification: string;
    experience: string;
    preferred_role: string;
    preferred_location: string;
    skills: string[];
    linkedin?: string;
    notes?: string;
    resume_url: string;
  }): UserAccount {
    const users = this.getAllUsers();
    const existingIdx = users.findIndex((u) => u.email.toLowerCase() === data.email.toLowerCase());

    const newUser: UserAccount = {
      id: existingIdx !== -1 ? users[existingIdx].id : 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      role: existingIdx !== -1 ? users[existingIdx].role : 'candidate',
      status: 'active',
      phone: data.phone,
      location: data.location,
      qualification: data.qualification,
      experience: data.experience,
      preferred_role: data.preferred_role,
      preferred_location: data.preferred_location,
      skills: data.skills,
      linkedin: data.linkedin,
      notes: data.notes,
      resume_url: data.resume_url,
      created_at: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      users[existingIdx] = newUser;
    } else {
      users.push(newUser);
    }

    setLocal(USER_STORAGE_KEYS.USERS_LIST, users);
    setLocal(USER_STORAGE_KEYS.CURRENT_SESSION, newUser);

    // Save to Resume Bank automatically as requested
    DataService.submitToResumeBank({
      name: data.name,
      email: data.email,
      phone: data.phone,
      qualification: data.qualification,
      experience: data.experience,
      location: data.location,
      preferred_role: data.preferred_role,
      preferred_location: data.preferred_location,
      skills: data.skills,
      notes: data.notes,
      resume_url: data.resume_url,
    });

    return newUser;
  },

  updateUserRole(userId: string, newRole: UserRole): boolean {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    user.role = newRole;
    setLocal(USER_STORAGE_KEYS.USERS_LIST, users);

    // Update active session if changing own role
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      current.role = newRole;
      setLocal(USER_STORAGE_KEYS.CURRENT_SESSION, current);
    }
    return true;
  },

  toggleUserStatus(userId: string): UserStatus {
    const users = this.getAllUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return 'active';

    user.status = user.status === 'active' ? 'blocked' : 'active';
    setLocal(USER_STORAGE_KEYS.USERS_LIST, users);
    return user.status;
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_STORAGE_KEYS.CURRENT_SESSION);
    localStorage.removeItem('aarya_raakh_admin_session');
    localStorage.removeItem('aarya_raakh_candidate_session_v1');
  },
};
