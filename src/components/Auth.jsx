import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { LogIn, UserPlus, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react'

export default function Auth({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
        
        // Supabase sends a verification email by default if enabled
        setMessage('Registration successful! Please check your email for a verification link, or try logging in.')
        setIsSignUp(false)
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        if (data.session) {
          onAuthSuccess(data.session)
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen flex flex-col justify-center px-6 py-12 relative border-x border-slate-200/50 shadow-2xl">
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-xl mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            DK
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Digital Khata</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Your Active Mobile Business Ledger</p>
        </div>

        {/* Action Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setIsSignUp(false); setError(null); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isSignUp 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(null); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isSignUp 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-red-700 text-xs font-semibold">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5 text-emerald-700 text-xs font-semibold">
            <Sparkles size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
                placeholder="shopkeeper@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1.5 ml-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all"
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isSignUp ? (
              <>
                <UserPlus size={16} />
                <span>Register Store</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In to Ledger</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] text-slate-400 font-semibold">
          Secured by Supabase Identity Auth
        </p>
      </div>
    </div>
  )
}
