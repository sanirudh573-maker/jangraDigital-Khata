import React, { useState } from 'react'
import { Search, Phone, ChevronRight, User, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function CustomerList({ customers, transactions, onSelectCustomer, onDeleteCustomer }) {
  const [searchQuery, setSearchQuery] = useState('')

  // Helper to calculate individual customer balance
  const getCustomerStats = (customerId) => {
    const customerTxs = transactions.filter(tx => tx.customer_id === customerId)
    const balance = customerTxs.reduce((acc, tx) => {
      if (tx.type === 'CREDIT') return acc + tx.amount
      if (tx.type === 'DEBIT') return acc - tx.amount
      return acc
    }, 0)
    return {
      balance,
      lastTxDate: customerTxs.length > 0 ? new Date(customerTxs[0].created_at) : null
    }
  }

  // Filter customers by search query
  const filteredCustomers = customers.filter(customer => {
    const term = searchQuery.toLowerCase()
    return (
      customer.name.toLowerCase().includes(term) ||
      customer.phone.includes(term)
    )
  })

  // Sort: show customers with active balances or most recent activity first
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const statsA = getCustomerStats(a.id)
    const statsB = getCustomerStats(b.id)
    
    // Sort by absolute balance desc
    return Math.abs(statsB.balance) - Math.abs(statsA.balance)
  })

  return (
    <div className="max-w-md mx-auto px-4 py-4 mb-24">
      {/* Search Input */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search customer by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm transition-all text-slate-900"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Directory Title */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {searchQuery ? 'Search Results' : 'Active Ledgers'} ({sortedCustomers.length})
        </h2>
        <span className="text-[10px] text-slate-400">Sorted by outstanding balance</span>
      </div>

      {/* Customer list container */}
      {sortedCustomers.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search size={24} />
          </div>
          <h3 className="text-slate-800 font-semibold mb-1">No customers found</h3>
          <p className="text-xs text-slate-500 max-w-[240px] mx-auto">
            {searchQuery
              ? "We couldn't find anyone matching that name or phone number."
              : 'Get started by clicking the "Add Customer" button below.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedCustomers.map(customer => {
            const { balance } = getCustomerStats(customer.id)
            const initials = customer.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)

            return (
              <div
                key={customer.id}
                onClick={() => onSelectCustomer(customer)}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-200 cursor-pointer transition-all active:scale-[0.99]"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                    balance > 0 
                      ? 'bg-red-50 text-red-600 border border-red-100' 
                      : balance < 0 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-slate-50 text-slate-600 border border-slate-100'
                  }`}>
                    {initials || <User size={16} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {customer.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <Phone size={10} className="text-slate-400" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Net Balance & Actions */}
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                  <div className="text-right">
                    {balance > 0 ? (
                      <div>
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">Due (उधार)</span>
                        <span className="text-sm font-extrabold text-red-600">₹{balance}</span>
                      </div>
                    ) : balance < 0 ? (
                      <div>
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider block">Advance (जमा)</span>
                        <span className="text-sm font-extrabold text-green-600">₹{Math.abs(balance)}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Settled</span>
                        <span className="text-sm font-semibold text-slate-500">₹0</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Delete button (with confirmation warning bubble/click protection) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm(`Are you sure you want to delete ${customer.name}? This will also delete all their transaction records permanently.`)) {
                        onDeleteCustomer(customer.id)
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 size={15} />
                  </button>

                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
