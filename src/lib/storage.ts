import { StudentProfile, createEmptyProfile } from '@/types/profile';

const STORAGE_KEY = 'collegesprout_profile';
const STORAGE_VERSION = 1;

interface StorageWrapper {
  version: number;
  profile: StudentProfile;
}

export function saveProfile(profile: StudentProfile): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const wrapper: StorageWrapper = { version: STORAGE_VERSION, profile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
    return true;
  } catch (e) {
    console.warn('Failed to save profile to localStorage:', e);
    return false;
  }
}

export function loadProfile(): StudentProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const wrapper: StorageWrapper = JSON.parse(raw);
    if (wrapper.version !== STORAGE_VERSION) return null;
    return wrapper.profile;
  } catch {
    return null;
  }
}

export function hasProfile(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getOrCreateProfile(): StudentProfile {
  const existing = loadProfile();
  if (existing) return existing;
  const fresh = createEmptyProfile();
  saveProfile(fresh);
  return fresh;
}
