
import React, { useState } from 'react';
import { api } from '../services/api';
import {
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  BookOpen,
  Brain,
  ArrowRight
} from 'lucide-react';

export default function Auth({ onAuthenticated, notify }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (!formData.name.trim()) {
        notify?.('Please enter your name.', 'error');
        return;
      }

      if (formData.password.length < 6) {
        notify?.('Password must contain at least 6 characters.', 'error');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        notify?.('Passwords do not match.', 'error');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await api.login(
          formData.email.trim(),
          formData.password,
          formData.rememberMe
        );
        notify?.('Login successful!', 'success');
      } else {
        await api.register(
          formData.name.trim(),
          formData.email.trim(),
          formData.password,
          formData.confirmPassword
        );
        notify?.('Account created successfully!', 'success');
      }

      onAuthenticated?.();
    } catch (error) {
      notify?.(error.message || 'Authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin((previous) => !previous);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false
    });
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SmartStudy AI</h1>
                <p className="text-sm text-blue-100">Intelligent Student Copilot</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-5">
              Study Smarter,
              <br />
              Retain Faster,
              <br />
              Score Higher.
            </h2>

            <p className="text-blue-100 leading-relaxed mb-10">
              Your personal AI-powered study assistant.
              Transform your study materials into meaningful
              notes, quizzes and clear explanations.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <BookOpen size={22} />
                <span>Smart Notes Summarization</span>
              </div>
              <div className="flex items-center gap-3">
                <Brain size={22} />
                <span>AI-Powered Quiz Generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles size={22} />
                <span>Personalized Learning Assistance</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-100">
            Powered by Google Gemini AI
          </p>
        </div>

        <div className="p-7 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <GraduationCap size={27} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SmartStudy AI</h1>
              <p className="text-xs text-slate-500">Intelligent Student Copilot</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles size={14} />
              AI-Powered Learning Platform
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>

            <p className="text-slate-500 mt-2">
              {isLogin
                ? 'Sign in to continue your learning journey.'
                : 'Join SmartStudy AI and study smarter.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                Remember me
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg"
            >
              {loading
                ? 'Please wait...'
                : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={switchMode}
              className="ml-2 text-blue-600 font-bold hover:text-blue-800"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            SmartStudy AI · Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
