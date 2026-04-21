import React, { useState } from 'react';
import authService from '../../services/authService';
import { Language } from '../../types';

interface LoginScreenProps {
  lang: Language;
  onSuccess?: () => void;
}

type Phase = 'form' | 'sent';

const LoginScreen: React.FC<LoginScreenProps> = ({ lang, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRtl = lang === 'he';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await authService.sendMagicLink(email.trim());
      if (res.success) {
        setPhase('sent');
        onSuccess?.();
      } else {
        setError(res.message || (lang === 'he' ? 'שגיאה בשליחה' : 'Failed to send'));
      }
    } catch {
      setError(lang === 'he' ? 'שגיאה. נסה שוב.' : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-800 mb-5">
            <span className="text-2xl">🕯️</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">
            {lang === 'he' ? 'כניסה לניהול האתר' : 'Sign in to manage your site'}
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            {lang === 'he'
              ? 'נשלח לך קישור כניסה למייל — ללא סיסמה'
              : 'We\'ll email you a sign-in link — no password needed'}
          </p>
        </div>

        {phase === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                {lang === 'he' ? 'כתובת אימייל' : 'Email address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={lang === 'he' ? 'your@email.com' : 'your@email.com'}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e7e2db] bg-white text-stone-800 placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-stone-300 transition-all text-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <Spinner />
              ) : (
                lang === 'he' ? 'שלח קישור כניסה' : 'Send sign-in link'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto text-3xl">
              📬
            </div>
            <h2 className="text-lg font-bold text-stone-800">
              {lang === 'he' ? 'בדוק את האימייל שלך' : 'Check your email'}
            </h2>
            <p className="text-sm text-stone-500">
              {lang === 'he'
                ? `שלחנו קישור כניסה ל־${email}. לחץ על הקישור כדי להיכנס.`
                : `We sent a sign-in link to ${email}. Click the link to continue.`}
            </p>
            <button
              onClick={() => { setPhase('form'); setEmail(''); }}
              className="text-xs text-stone-400 hover:text-stone-600 underline transition-colors"
            >
              {lang === 'he' ? 'שלח שוב עם אימייל אחר' : 'Try a different email'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export default LoginScreen;