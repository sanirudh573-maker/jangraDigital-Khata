import React, { useState } from 'react'
import { ArrowUpRight, ArrowDownLeft, Users, Wallet, Edit2, Check } from 'lucide-react'

export default function DashboardStats({ customers, transactions, onLogout, isLive, storeName, onUpdateStoreName, theme, onChangeTheme }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(storeName)

  // Calculate stats
  // Total Outstanding Balance: Sum of CREDIT - DEBIT across all transactions
  const totalBalance = transactions.reduce((acc, tx) => {
    if (tx.type === 'CREDIT') return acc + tx.amount
    if (tx.type === 'DEBIT') return acc - tx.amount
    return acc
  }, 0)

  // Today's Cash Inflow: Total sum of DEBIT created today (local time comparison)
  const today = new Date().toDateString()
  const todayCashInflow = transactions
    .filter(tx => tx.type === 'DEBIT' && new Date(tx.created_at).toDateString() === today)
    .reduce((acc, tx) => acc + tx.amount, 0)

  // Today's Credit Outflow (optional/bonus stat)
  const todayCreditGiven = transactions
    .filter(tx => tx.type === 'CREDIT' && new Date(tx.created_at).toDateString() === today)
    .reduce((acc, tx) => acc + tx.amount, 0)

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateStoreName(tempName.trim())
      setIsEditingName(false)
    }
  }

  // Theme styling mapping
  const themeColors = {
    indigo: 'from-indigo-900 to-slate-900 border-indigo-500/20 bg-indigo-600 shadow-indigo-500/20',
    emerald: 'from-emerald-900 to-slate-900 border-emerald-500/20 bg-emerald-600 shadow-emerald-500/20',
    amber: 'from-amber-950 to-slate-900 border-amber-500/20 bg-amber-600 shadow-amber-500/20',
    slate: 'from-slate-800 to-slate-950 border-slate-500/20 bg-slate-700 shadow-slate-500/20'
  }

  const palettes = [
    { id: 'indigo', color: 'bg-indigo-500' },
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'amber', color: 'bg-amber-500' },
    { id: 'slate', color: 'bg-slate-500' }
  ]

  return (
    <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md text-white shadow-lg border-b border-slate-800">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Main Title / Brand */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`p-2 rounded-xl text-white shadow-md transition-all ${
              theme === 'indigo' ? 'bg-indigo-600 shadow-indigo-500/20' :
              theme === 'emerald' ? 'bg-emerald-600 shadow-emerald-500/20' :
              theme === 'amber' ? 'bg-amber-600 shadow-amber-500/20' : 'bg-slate-700 shadow-slate-500/20'
            }`}>
              <Wallet size={20} className="animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-white outline-none focus:border-indigo-500 w-32"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-1 bg-indigo-600 hover:bg-indigo-700 rounded-md">
                    <Check size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group">
                  <h1 className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent truncate max-w-[140px]">
                    {storeName}
                  </h1>
                  <button 
                    onClick={() => setIsEditingName(true)} 
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-0.5 transition-opacity"
                    title="Edit Shop Name"
                  >
                    <Edit2 size={10} />
                  </button>
                </div>
              )}
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DIGITAL ACTIVE LEDGER</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Theme circle selector */}
            <div className="flex items-center gap-1 bg-slate-800/40 p-1 rounded-full border border-slate-800/60">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onChangeTheme(p.id)}
                  className={`w-3.5 h-3.5 rounded-full ${p.color} transition-transform hover:scale-110 active:scale-95 relative cursor-pointer`}
                  title={`${p.id} Theme`}
                >
                  {theme === p.id && (
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] text-white font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>

            <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              {isLive ? 'Live' : 'Demo'}
            </span>
            {isLive && onLogout && (
              <button
                onClick={onLogout}
                className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-lg border border-slate-700 transition-colors font-bold cursor-pointer"
              >
                Log Out
              </button>
            )}
          </div>
        </div>

        {/* Highlight Card: Total Outstanding */}
        <div className={`bg-gradient-to-br ${themeColors[theme] || themeColors.indigo} rounded-2xl p-4 border relative overflow-hidden mb-3 shadow-inner transition-all duration-300`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <p className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">Total Outstanding Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">
              ₹{Math.abs(totalBalance).toLocaleString('en-IN')}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              totalBalance > 0 ? 'bg-red-500/20 text-red-300' : totalBalance < 0 ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-300'
            }`}>
              {totalBalance > 0 ? 'To Receive (Udhar)' : totalBalance < 0 ? 'To Pay (Advance)' : 'Settled'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Net balance sum across all customers
          </p>
        </div>

        {/* Small stats row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Today's Cash Inflow */}
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Today Cash In</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="p-1 rounded-lg bg-green-500/10 text-green-400">
                <ArrowDownLeft size={12} />
              </div>
              <span className="text-sm font-bold text-green-400">₹{todayCashInflow}</span>
            </div>
          </div>

          {/* Today's Credit Outflow */}
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Today Credit Out</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="p-1 rounded-lg bg-red-500/10 text-red-400">
                <ArrowUpRight size={12} />
              </div>
              <span className="text-sm font-bold text-red-400">₹{todayCreditGiven}</span>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Customers</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Users size={12} />
              </div>
              <span className="text-sm font-bold text-indigo-300">{customers.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
