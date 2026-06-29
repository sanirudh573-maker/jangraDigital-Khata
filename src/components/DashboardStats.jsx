import React from 'react'
import { ArrowUpRight, ArrowDownLeft, Users, Wallet } from 'lucide-react'

export default function DashboardStats({ customers, transactions, onLogout, isLive }) {
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

  return (
    <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md text-white shadow-lg border-b border-slate-800">
      <div className="max-w-md mx-auto px-4 py-4">
        {/* Main Title / Brand */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md transition-all flex items-center justify-center border border-slate-700/55 flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[12px] font-extrabold tracking-tight bg-slate-100 truncate">
                Jangra Store & Parlour
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">DIGITAL LEDGER</p>
            </div>
          </div>          <div className="flex items-center gap-2.5">
            <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
              {isLive ? 'Supabase Live' : 'Demo Mode'}
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
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-2xl p-4 border border-emerald-500/20 relative overflow-hidden mb-3 shadow-inner transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
          <p className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">Total Outstanding Balance</p>
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
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Users size={12} />
              </div>
              <span className="text-sm font-bold text-emerald-300">{customers.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
