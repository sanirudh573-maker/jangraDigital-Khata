import React, { useState, useEffect } from 'react'
import { Plus, HelpCircle, Info, Database } from 'lucide-react'
import { isSupabaseConfigured } from './supabaseClient'
import { dataService } from './services/dataService'

// Import components
import DashboardStats from './components/DashboardStats'
import CustomerList from './components/CustomerList'
import LedgerView from './components/LedgerView'
import CustomerModal from './components/CustomerModal'
import TransactionModal from './components/TransactionModal'

export default function App() {
  // Application State
  const [customers, setCustomers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  
  // Modal toggles
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState('CREDIT') // 'CREDIT' or 'DEBIT'
  
  // App UI Helpers
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true)
      const fetchedCustomers = await dataService.getCustomers()
      const fetchedTransactions = await dataService.getTransactions()
      
      setCustomers(fetchedCustomers)
      setTransactions(fetchedTransactions)
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Could not connect to database. Checking setup...')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Refetch data when selected customer changes or on any write to keep states synced
  const handleAddCustomerSubmit = async ({ name, phone }) => {
    const newCustomer = await dataService.addCustomer(name, phone)
    await loadData()
    // Open the new customer ledger view immediately for a snappy feel!
    setSelectedCustomer(newCustomer)
  }

  const handleDeleteCustomerSubmit = async (customerId) => {
    await dataService.deleteCustomer(customerId)
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer(null)
    }
    await loadData()
  }

  const handleAddTransactionSubmit = async ({ amount, type, description }) => {
    if (!selectedCustomer) return
    await dataService.addTransaction(selectedCustomer.id, amount, type, description)
    await loadData()
  }

  const handleDeleteTransactionSubmit = async (txId) => {
    await dataService.deleteTransaction(txId)
    await loadData()
  }

  // Handle transaction trigger from passbook
  const triggerAddTransaction = (type) => {
    setTransactionType(type)
    setIsTransactionModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      {/* Container: Max-width mobile design simulation for clean UI on all viewports */}
      <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen flex flex-col shadow-2xl relative border-x border-slate-200/50">
        
        {/* Loading Overlay */}
        {loading && customers.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-slate-500 font-medium">Loading Ledgers...</p>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-600 text-white text-xs font-semibold px-4 py-3 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
              <Info size={14} />
              <span>{error}</span>
            </div>
            <button onClick={loadData} className="underline text-[10px] uppercase font-bold hover:text-red-100">
              Retry
            </button>
          </div>
        )}

        {/* Main Content Router */}
        {!loading || customers.length > 0 ? (
          selectedCustomer ? (
            /* Passbook/Ledger View of a specific customer */
            <LedgerView
              customer={selectedCustomer}
              transactions={transactions}
              onBack={() => setSelectedCustomer(null)}
              onAddTransaction={triggerAddTransaction}
              onDeleteTransaction={handleDeleteTransactionSubmit}
            />
          ) : (
            /* Main Directory/Dashboard View */
            <div className="flex-1 flex flex-col">
              {/* Stats Header */}
              <DashboardStats customers={customers} transactions={transactions} />

              {/* Guide Toggle Banner (Only shows if Supabase isn't configured) */}
              {!isSupabaseConfigured && (
                <div className="mx-4 mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm">
                  <Database size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-indigo-900 leading-tight">Demo Mode Active</h4>
                    <p className="text-[10px] text-indigo-700 mt-0.5 leading-relaxed">
                      Transactions are saved locally on this browser. Click "Setup Supabase" to enable cloud sync.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSetupGuide(true)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 px-2 py-1 rounded-lg transition-colors flex-shrink-0"
                  >
                    Setup Guide
                  </button>
                </div>
              )}

              {/* Customer Directory List */}
              <div className="flex-1">
                <CustomerList
                  customers={customers}
                  transactions={transactions}
                  onSelectCustomer={setSelectedCustomer}
                  onDeleteCustomer={handleDeleteCustomerSubmit}
                />
              </div>

              {/* Floating Action Button (FAB) for Add Customer */}
              <button
                onClick={() => setIsCustomerModalOpen(true)}
                className="fixed bottom-6 right-1/2 translate-x-[150px] z-30 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/30 transition-transform active:scale-[0.95]"
                style={{ right: 'max(16px, calc((100vw - 448px) / 2 + 16px))' }}
                title="Add New Customer"
              >
                <Plus size={24} />
              </button>
            </div>
          )
        ) : null}

        {/* Modals */}
        <CustomerModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          onSubmit={handleAddCustomerSubmit}
        />

        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          onSubmit={handleAddTransactionSubmit}
          type={transactionType}
          customerName={selectedCustomer ? selectedCustomer.name : ''}
        />

        {/* Setup Guide Modal */}
        {showSetupGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setShowSetupGuide(false)}></div>
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 z-10 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Database size={16} className="text-indigo-600" />
                    <span>Supabase Schema Configuration</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Copy SQL queries below to set up your backend</p>
                </div>
                <button
                  onClick={() => setShowSetupGuide(false)}
                  className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <Plus className="rotate-45" size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-600">
                <p>
                  1. Go to your <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">Supabase Dashboard</a> and create a new project.
                </p>
                <p>
                  2. Open the <strong>SQL Editor</strong> in Supabase and run the following queries to create the necessary tables:
                </p>
                
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto text-[10px] font-mono select-all">
{`-- Create customers table
create table customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete cascade not null,
  amount numeric not null,
  type text check (type in ('CREDIT', 'DEBIT')) not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`}
                </pre>

                <p>
                  3. Create a <code>.env</code> file in this project root (or update variables) and add:
                </p>
                
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto text-[10px] font-mono select-all">
{`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key`}
                </pre>

                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-xl border border-yellow-100 flex items-start gap-2">
                  <HelpCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] leading-relaxed">
                    <strong>Note:</strong> Make sure row-level security (RLS) is either disabled or configured to allow anonymous reads and writes for quick demonstration.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSetupGuide(false)}
                className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
