import api, { setSession, clearSession } from './api';

function normalizeProfile(profile, roleHint) {
  if (!profile) return null;
  return { ...profile, id: profile._id, name: profile.name || profile.fullName, role: profile.role || roleHint };
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });

  if (!data?.success || !data?.data?.token || !data?.data?.profile) {
    console.error('[authService.login] unexpected response shape:', data);
    const err = new Error('Unexpected login response shape.');
    err.friendlyMessage = 'Something went wrong reading the server response. Check the console.';
    throw err;
  }

  const { token, role, profile } = data.data;
  const user = normalizeProfile(profile, role);

  setSession(token, user.role);
  return user;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    clearSession();
  }
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');

  const profile = data?.data?.profile || data?.data?.user || data?.profile || data?.user;
  const role = data?.data?.role || profile?.role;

  if (!profile) {
    console.error('[authService.getCurrentUser] unexpected response shape:', data);
    throw new Error('Unexpected /auth/me response shape — check the console.');
  }

  return normalizeProfile(profile, role);
}

export async function changePassword({ currentPassword, newPassword }) {
  const { data } = await api.put('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
}
