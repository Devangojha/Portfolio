import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, signup, loginDemoUser } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signin') {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter both email and password.');
        return;
      }
      const res = login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
        return;
      }
      onSuccess();
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please complete all registration fields.');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Password must be at least 4 characters long.');
        return;
      }
      const res = signup(name, email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Account registration failed.');
        return;
      }
      onSuccess();
    }
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            {mode === 'signin' ? 'Nexus Authentication' : 'Create Hardware Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === 'signin'
              ? 'Access real-time telemetry, orders, and saved wishlists.'
              : 'Join Nexus Labs to unlock allocation reservations & member pricing.'}
          </p>
        </div>

        {/* Quick Demo Login Affordance */}
        <div className="p-4 bg-gradient-to-r from-cyan-50 via-sky-50 to-cyan-50 border border-cyan-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-cyan-900 font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
              Evaluation Mode Available
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">1-Click Test</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Instant login as <strong className="text-slate-900">Alex Vance</strong> or sign in with demo credentials: <span className="font-mono text-[10px] text-cyan-800 bg-cyan-100/60 px-1 py-0.5 rounded">alex.vance@nexus-tech.io</span> / <span className="font-mono text-[10px] text-cyan-800 bg-cyan-100/60 px-1 py-0.5 rounded">password123</span>
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            Instant Demo Account Sign In
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-start gap-2">
            <span className="font-bold text-rose-800">Error:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. Elena Rostova"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="developer@nexus-tech.io"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 font-medium block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {mode === 'signin' ? 'Authenticate Session' : 'Register Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with SHA-256 session persistence</span>
        </div>
      </div>
    </div>
  );
};
