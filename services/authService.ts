import { SERVER_URL } from './serverIntegrationService';

export interface CurrentUser {
  id: string;
  email: string;
  displayName?: string;
  plan?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const authService = {
  /** Check if there is an active session. Returns user or null. */
  async getMe(): Promise<CurrentUser | null> {
    try {
      const res = await fetch(`${SERVER_URL}/api/auth/me`, {
        credentials: 'include',
        headers: JSON_HEADERS,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.success ? (data.data as CurrentUser) : null;
    } catch {
      return null;
    }
  },

  /** Send a magic link to the given email. */
  async sendMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${SERVER_URL}/api/auth/send-magic-link`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return { success: data.success, message: data.message || '' };
  },

  /** Logout — clears the session cookie. */
  async logout(): Promise<void> {
    await fetch(`${SERVER_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: JSON_HEADERS,
    });
  },
};

export default authService;