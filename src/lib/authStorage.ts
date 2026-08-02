export interface RegisteredUser {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const STORAGE_KEY = 'cvpro_registered_accounts';

export function getLocalAccounts(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAccount(name: string, email: string, password: string): RegisteredUser {
  const accounts = getLocalAccounts();
  const normalizedEmail = email.toLowerCase().trim();
  const existingIndex = accounts.findIndex(a => a.email.toLowerCase() === normalizedEmail);

  const newUser: RegisteredUser = {
    name: name.trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    passwordHash: btoa(encodeURIComponent(password)),
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    accounts[existingIndex] = newUser;
  } else {
    accounts.push(newUser);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Erro ao salvar conta no localStorage:', e);
  }

  return newUser;
}

export function verifyLocalAccount(email: string, password: string): { success: boolean; user?: RegisteredUser; reason?: 'not_found' | 'wrong_password' } {
  const accounts = getLocalAccounts();
  const normalizedEmail = email.toLowerCase().trim();
  const user = accounts.find(a => a.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return { success: false, reason: 'not_found' };
  }

  const encodedInputPassword = btoa(encodeURIComponent(password));
  if (user.passwordHash !== encodedInputPassword) {
    return { success: false, reason: 'wrong_password' };
  }

  return { success: true, user };
}
