import React from 'react'
import { ArrowLeft, Phone, Share2, Plus, ArrowUpRight, ArrowDownLeft, Trash2, Calendar } from 'lucide-react'

export default function LedgerView({ customer, transactions, onBack, onAddTransaction, onDeleteTransaction }) {
  // Filter transactions for this customer
  const customerTxs = transactions.filter(tx => tx.customer_id === customer.id)

  // Calculate stats
  const totalCredit = customerTxs
    .filter(tx => tx.type === 'CREDIT')
    .reduce((acc, tx) => acc + tx.amount, 0)
  
  const totalDebit = customerTxs
    .filter(tx => tx.type === 'DEBIT')
    .reduce((acc, tx) => acc + tx.amount, 0)

  const balance = totalCredit - totalDebit

  // Group transactions by month for scannability
  const groupedTxs = customerTxs.reduce((groups, tx) => {
    const date = new Date(tx.created_at)
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(tx)
    return groups
  }, {})

  // Helper to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper to share balance details
  const handleShare = () => {
    const message = `Hello ${customer.name}, your current outstanding balance in our ledger is ₹${Math.abs(balance)}. Status: ${
      balance > 0 ? `DUE (उधार) of ₹${balance}` : balance < 0 ? `ADVANCE (जमा) of ₹${Math.abs(balance)}` : 'SETTLED'
    }. Please verify. Thank you!`
    
    // Check if WhatsApp Web or App can be opened
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="max-w-md mx-auto flex flex-col min-height-[100svh] bg-slate-50 relative pb-28">
      {/* Top Header */}
      <div className="bg-slate-900 text-white sticky top-0 z-20 px-4 py-4 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${customer.phone}`}
              className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-600/20 rounded-xl transition-all border border-indigo-500/20"
              title="Call Customer"
            >
              <Phone size={16} />
            </a>
            <button
              onClick={handleShare}
              className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600/20 rounded-xl transition-all border border-emerald-500/20"
              title="Share Ledger"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Customer Profile Details */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mb-2 shadow-lg shadow-indigo-500/25 border border-indigo-500/30">
            {customer.name.substring(0, 2).toUpperCase()}
          </div>
          <h2 className="text-base font-bold tracking-wide">{customer.name}</h2>
          <p className="text-xs text-slate-400">{customer.phone}</p>
        </div>

        {/* Balance Status card */}
        <div className="mt-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Net Due Balance</p>
          <div className="text-2xl font-extrabold mt-1">
            ₹{Math.abs(balance).toLocaleString('en-IN')}
          </div>
          <p className={`text-xs font-semibold mt-1.5 inline-block px-3 py-0.5 rounded-full ${
            balance > 0 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : balance < 0 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-slate-600/20 text-slate-300 border border-slate-500/30'
          }`}>
            {balance > 0 ? 'Customer will PAY (Udhar)' : balance < 0 ? 'You owe customer (Advance)' : 'Settled (₹0)'}
          </p>
        </div>

        {/* Mini stats grid */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="bg-slate-800/40 rounded-xl p-2 flex items-center gap-2 border border-slate-800/60 justify-center">
            <span className="text-[10px] text-red-400 font-bold uppercase">Total Udhar:</span>
            <span className="text-xs font-bold text-red-400">₹{totalCredit}</span>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-2 flex items-center gap-2 border border-slate-800/60 justify-center">
            <span className="text-[10px] text-green-400 font-bold uppercase">Total Received:</span>
            <span className="text-xs font-bold text-green-400">₹{totalDebit}</span>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-4 py-4 flex-1">
        {customerTxs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center mt-6 shadow-sm">
            <Calendar className="mx-auto text-slate-300 mb-2" size={32} />
            <h3 className="text-slate-700 font-semibold text-sm">No transactions yet</h3>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1">
              Tap the buttons below to record your first credit or payment transaction.
            </p>
          </div>
        ) : (
          Object.keys(groupedTxs).map(monthYear => (
            <div key={monthYear} className="mb-6">
              <div className="sticky top-[270px] bg-slate-50 py-1.5 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {monthYear}
              </div>
              <div className="space-y-2.5">
                {groupedTxs[monthYear].map(tx => (
                  <div
                    key={tx.id}
                    className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-sm relative group hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-xl border ${
                        tx.type === 'CREDIT' 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : 'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {tx.type === 'CREDIT' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">
                          {tx.description}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          {formatDate(tx.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-extrabold ${
                        tx.type === 'CREDIT' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount}
                      </span>
                      
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this transaction? this will recalculate the ledger.')) {
                            onDeleteTransaction(tx.id)
                          }
                        }}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-100 px-4 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          {/* Give Credit button */}
          <button
            onClick={() => onAddTransaction('CREDIT')}
            className="flex items-center justify-center gap-1.5 py-3.5 px-4 bg-red-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>GIVE CREDIT (उधार दिया)</span>
          </button>

          {/* Receive Payment button */}
          <button
            onClick={() => onAddTransaction('DEBIT')}
            className="flex items-center justify-center gap-1.5 py-3.5 px-4 bg-green-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>GET PAYMENT (पैसा मिला)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
