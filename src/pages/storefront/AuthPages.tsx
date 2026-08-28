import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { auditLogger } from '../../services/auditLogger';

interface Props {
  mode: 'login' | 'register' | 'forgot-password';
  onNavigate: (path: string) => void;
}

export const AuthPages: React.FC<Props> = ({ mode, onNavigate }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // OTP registration states
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const handlePostAuthRedirect = (userEmail: string) => {
    const redirectPath = localStorage.getItem('redirect_after_auth');
    if (redirectPath) {
      localStorage.removeItem('redirect_after_auth');
      onNavigate(redirectPath);
    } else if (userEmail.toLowerCase().includes('admin') || userEmail.toLowerCase() === 'admin@purelis.com') {
      onNavigate('/admin/dashboard');
    } else {
      onNavigate('/account');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const googleEmail = 'google.member@purelis.com';
      const success = await login(googleEmail, 'Password123!');
      if (!success) {
        await register(googleEmail, 'Password123!', 'Google', 'Member');
        await login(googleEmail, 'Password123!');
      }
      auditLogger.log('AUTH_LOGIN', googleEmail, 'Authenticated via Google 1-Click', 'SUCCESS');
      showToast('Signed in with Google', 'Welcome to Purelis botanical family.', 'success');
      handlePostAuthRedirect(googleEmail);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtpForRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      showToast('Missing Fields', 'Please fill in all registration details.', 'error');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep('otp');
    auditLogger.log('OTP_SENT', email, 'Sent email verification OTP for signup', 'SUCCESS');
    showToast('Verification Code Sent!', `[DEMO OTP]: Your 6-digit code is ${code}`, 'success');
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (enteredOtp.trim() !== generatedOtp.trim() && enteredOtp.trim() !== '123456') {
        auditLogger.log('OTP_VERIFY', email, 'OTP verification failed - invalid code', 'FAILURE');
        showToast('Invalid Code', 'Please enter the correct 6-digit verification code.', 'error');
        setLoading(false);
        return;
      }

      auditLogger.log('OTP_VERIFY', email, 'OTP verification successful', 'SUCCESS');
      const success = await register(email, password, firstName, lastName);
      if (success) {
        showToast('Account Created!', 'Email verified and account successfully registered.', 'success');
        handlePostAuthRedirect(email);
      } else {
        showToast('Registration Error', 'An account with this email already exists.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          showToast('Welcome Back!', 'Signed into your Purelis account.', 'success');
          handlePostAuthRedirect(email);
        } else {
          showToast('Invalid Credentials', 'Please check your email and password.', 'error');
        }
      } else if (mode === 'forgot-password') {
        setResetSent(true);
        auditLogger.log('ADMIN_ACTION', email, 'Password reset requested', 'SUCCESS');
        showToast('Reset Link Sent', `Instructions sent to ${email}`, 'success');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-18 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-10 shadow-sm space-y-6">
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829]">
              {mode === 'login' && 'Sign In to Purelis'}
              {mode === 'register' && (step === 'form' ? 'Create Your Account' : 'Verify Your Email (OTP)')}
              {mode === 'forgot-password' && 'Reset Password'}
            </h1>
            <p className="text-xs text-[#5E6E64]">
              {mode === 'login' && 'Access your orders, saved botanical rituals, and addresses.'}
              {mode === 'register' && (step === 'form' ? 'Join for complimentary gifts, birthday treats, and rapid checkout.' : `We have sent a 6-digit verification code to ${email}`)}
              {mode === 'forgot-password' && 'Enter your email to receive a password reset link.'}
            </p>
          </div>

          {resetSent ? (
            <div className="p-6 rounded-xl bg-[#EAEFEA] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#1C3829]">Check Your Inbox</h3>
              <p className="text-xs text-[#5E6E64]">We have emailed password reset instructions to {email}.</p>
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs font-bold text-[#1C3829] underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : mode === 'register' && step === 'otp' ? (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] text-center space-y-2">
                <KeyRound className="w-8 h-8 text-[#1C3829] mx-auto" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">Enter 6-Digit Verification Code</span>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center font-mono text-xl tracking-[0.3em] p-3 rounded-lg border border-[#DDD5C7] bg-white focus:outline-hidden focus:border-[#1C3829]"
                />
                <span className="text-[10px] text-stone-500 block">
                  (Hint: Check toast notification above for your demo code, or use <strong className="text-[#1C3829]">123456</strong>)
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify &amp; Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-center text-xs text-[#7A8A7F] hover:underline pt-2 cursor-pointer"
              >
                ← Back to registration details
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Continue with Google 1-Click Fast Button */}
              {mode !== 'forgot-password' && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-700 transition-colors flex items-center justify-center gap-3 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.16 21.35 7.23 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.14 0 9.87 0 12s.44 3.86 1.2 5.4l4.08-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.16 2.65 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-[#ECE7DE]"></div>
                    <span className="flex-shrink mx-4 text-[10px] uppercase font-bold tracking-wider text-stone-400">or with email</span>
                    <div className="flex-grow border-t border-[#ECE7DE]"></div>
                  </div>
                </>
              )}

              <form onSubmit={mode === 'register' ? handleSendOtpForRegister : handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-stone-700 block mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Amelia"
                        className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Chen"
                        className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amelia@example.com"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  />
                </div>

                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold uppercase text-stone-700">Password</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => onNavigate('/forgot-password')}
                          className="text-[11px] text-[#8DA792] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Send Verification OTP'}
                    {mode === 'forgot-password' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mode Switchers */}
          <div className="text-center pt-2 text-xs text-[#5E6E64] border-t border-stone-100">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('/register')}
                  className="font-bold text-[#1C3829] hover:underline ml-1 cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('/login')}
                  className="font-bold text-[#1C3829] hover:underline ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
