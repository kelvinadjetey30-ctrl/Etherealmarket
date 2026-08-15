import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Profile, UserRole } from '@/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const LOCAL_USERS_KEY = 'em_users';
const LOCAL_SESSION_KEY = 'em_session';

function loadLocalUsers(): Record<string, { email: string; password: string; profile: Profile }> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocalUsers(users: Record<string, { email: string; password: string; profile: Profile }>) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUser(null);
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (data) setUser(data as Profile);
    } else {
      const sessionId = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!sessionId) {
        setUser(null);
        return;
      }
      const users = loadLocalUsers();
      const entry = users[sessionId];
      if (entry) setUser(entry.profile);
      else {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshProfile();
      setLoading(false);
    })();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        refreshProfile();
      });
      return () => subscription.unsubscribe();
    }
  }, [refreshProfile]);

  const signUp = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          role: 'customer',
          balance: 0,
        });
      }
      await refreshProfile();
      return { error: null };
    }

    const users = loadLocalUsers();
    if (Object.values(users).some((u) => u.email === email)) {
      return { error: 'Email already registered' };
    }
    const id = `user_${Date.now()}`;
    const profile: Profile = {
      id,
      email,
      role: 'customer',
      balance: 0,
      created_at: new Date().toISOString(),
    };
    users[id] = { email, password, profile };
    saveLocalUsers(users);
    localStorage.setItem(LOCAL_SESSION_KEY, id);
    setUser(profile);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      await refreshProfile();
      return { error: null };
    }

    const users = loadLocalUsers();
    const entry = Object.values(users).find((u) => u.email === email && u.password === password);
    if (!entry) return { error: 'Invalid email or password' };
    localStorage.setItem(LOCAL_SESSION_KEY, entry.profile.id);
    setUser(entry.profile);
    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
  };

  const updateBalance = (newBalance: number) => {
    if (!user) return;
    const updated = { ...user, balance: newBalance };
    setUser(updated);
    if (!isSupabaseConfigured) {
      const users = loadLocalUsers();
      if (users[user.id]) {
        users[user.id].profile = updated;
        saveLocalUsers(users);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateBalance, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function ensureDemoAdmin() {
  if (isSupabaseConfigured) return;
  const users = loadLocalUsers();
  const adminEmail = 'admin@etherealmarket.demo';
  if (!Object.values(users).some((u) => u.email === adminEmail)) {
    const id = 'admin_demo_001';
    users[id] = {
      email: adminEmail,
      password: 'AdminDemo123!',
      profile: {
        id,
        email: adminEmail,
        role: 'admin' as UserRole,
        balance: 0,
        created_at: new Date().toISOString(),
      },
    };
    saveLocalUsers(users);
  }
}
