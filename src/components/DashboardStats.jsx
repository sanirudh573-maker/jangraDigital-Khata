import React from 'react'
import { ArrowUpRight, ArrowDownLeft, Users, Wallet } from 'lucide-react'

export default function DashboardStats({ customers, transactions }) {
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-500/20 shadow-md">
              <Wallet size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
                Digital Khata
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">DIGITAL ACTIVE LEDGER</p>
            </div>
          </div>
          <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full font-semibold">
            {localStorage.getItem('khata_customers') && !import.meta.env.VITE_SUPABASE_URL ? 'Demo Mode' : 'Supabase Live'}
          </span>
        </div>

        {/* Highlight Card: Total Outstanding */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-4 border border-indigo-500/20 relative overflow-hidden mb-3 shadow-inner">
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
