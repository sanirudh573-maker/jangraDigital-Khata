import React, { useState } from 'react'
import { ArrowLeft, Phone, Share2, Plus, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, FileText, X, MessageSquare } from 'lucide-react'

export default function LedgerView({ customer, transactions, onBack, onAddTransaction, onDeleteTransaction }) {
  const [txFilter, setTxFilter] = useState('ALL')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('friendly')

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

  // Apply filters
  const filteredTxs = customerTxs.filter(tx => {
    if (txFilter === 'ALL') return true
    return tx.type === txFilter
  })

  // Group transactions by month for scannability
  const groupedTxs = filteredTxs.reduce((groups, tx) => {
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

  // PDF / Print Handler
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank')
    const txRows = customerTxs.map(tx => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-size: 12px; color: #475569;">${formatDate(tx.created_at)}</td>
        <td style="padding: 12px; font-size: 12px; font-weight: bold; color: #1e293b;">${tx.description}</td>
        <td style="padding: 12px; font-size: 12px; font-weight: bold; text-align: right; color: ${tx.type === 'CREDIT' ? '#dc2626' : '#16a34a'}">
          ${tx.type === 'CREDIT' ? '+' : '-'} ₹${tx.amount}
        </td>
      </tr>
    `).join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Ledger Statement - ${customer.name}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 0; color: #334155; background-color: #f8fafc; }
            .preview-container { max-width: 800px; margin: 30px auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05); border: 1px solid #f1f5f9; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px; }
            .title { font-size: 22px; font-weight: 850; color: #0f172a; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
            .details { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 12px; line-height: 1.5; }
            .details-left, .details-right { flex: 1; }
            .details-right { text-align: right; }
            .balance-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 24px; text-align: center; }
            .balance-val { font-size: 26px; font-weight: 800; color: #0f172a; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f1f5f9; padding: 10px 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #475569; text-align: left; border-bottom: 1px solid #cbd5e1; }
            .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
            
            @media (max-width: 640px) {
              .preview-container { margin: 15px; padding: 15px; border-radius: 12px; }
              .details { flex-direction: column; gap: 15px; }
              .details-right { text-align: left; }
            }

            @media print {
              .no-print { display: none !important; }
              body { background-color: white; }
              .preview-container { border: none; box-shadow: none; margin: 0; padding: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <!-- Sticky Top Bar for Action Preview -->
          <div class="no-print" style="position: sticky; top: 0; background: #0f172a; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); z-index: 100; font-family: sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="background: #10b981; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">JS</div>
              <span style="color: white; font-size: 13px; font-weight: bold;">Jangra Store Ledger Preview</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 11px;">
                Save PDF / Print
              </button>
              <button onclick="window.close()" style="background: #374151; color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 11px;">
                Close
              </button>
            </div>
          </div>

          <div class="preview-container">
            <div class="header">
              <div class="title">Jangra Store</div>
              <div class="subtitle">Ledger Statement Report</div>
            </div>
            <div class="details">
              <div class="details-left">
                <strong>CUSTOMER NAME:</strong><br/>
                <span style="font-size: 14px; font-weight: 700; color: #0f172a;">${customer.name}</span><br/>
                Phone: ${customer.phone}<br/>
                Date Generated: ${new Date().toLocaleDateString('en-IN')}
              </div>
              <div class="details-right">
                <strong>LEDGER SUMMARY:</strong><br/>
                Total Transactions: ${customerTxs.length}<br/>
                Total Credit (उधार): ₹${totalCredit}<br/>
                Total Debit (जमा): ₹${totalDebit}
              </div>
            </div>
            <div class="balance-card">
              <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">NET OUTSTANDING BALANCE</div>
              <div class="balance-val">₹${Math.abs(balance).toLocaleString('en-IN')}</div>
              <div style="font-size: 11px; font-weight: 600; color: ${balance > 0 ? '#dc2626' : balance < 0 ? '#16a34a' : '#64748b'}; margin-top: 4px;">
                ${balance > 0 ? 'Customer will PAY (Udhar)' : balance < 0 ? 'You owe customer (Advance)' : 'Settled (₹0)'}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">Date & Time</th>
                  <th style="width: 45%;">Description</th>
                  <th style="width: 25%; text-align: right;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${txRows || `<tr><td colspan="3" style="text-align: center; padding: 24px; color: #94a3b8;">No transactions.</td></tr>`}
              </tbody>
            </table>
            <div class="footer">
              Generated via Jangra Store app. Thank you!
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Custom Message Templates
  const templates = {
    friendly: `नमस्ते ${customer.name} जी, आपके खाते का बकाया बैलेंस ₹${Math.abs(balance)} (उधार) है। कृपया समय मिलने पर भुगतान कर दें। धन्यवाद! - Jangra Store`,
    professional: `Dear ${customer.name}, your ledger statement at Jangra Store shows an outstanding balance of ₹${Math.abs(balance)}. Please settle the invoice at your earliest convenience. Thank you.`,
    urgent: `अति आवश्यक सूचना: ${customer.name} जी, आपके खाते का ₹${Math.abs(balance)} का उधार काफी समय से लंबित है। कृपया आज ही इसका भुगतान करें ताकि भविष्य की असुविधा से बचा जा सके। - Jangra Store`
  }

  const handleShareWhatsApp = () => {
    const message = templates[selectedTemplate]
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setIsShareModalOpen(false)
  }

  return (
    <div className="max-w-md mx-auto flex flex-col min-height-[100svh] bg-slate-50 relative pb-28">
      {/* Top Header */}
      <div className="bg-slate-900 text-white sticky top-0 z-20 px-4 py-4 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${customer.phone}`}
              className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600/20 rounded-xl transition-all border border-emerald-500/20"
              title="Call Customer"
            >
              <Phone size={16} />
            </a>
            
            <button
              onClick={handlePrintPDF}
              className="p-2 text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-xl transition-all border border-rose-500/20 cursor-pointer"
              title="Print Ledger Report"
            >
              <FileText size={16} />
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600/20 rounded-xl transition-all border border-emerald-500/20 cursor-pointer"
              title="WhatsApp Reminder Options"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Customer Profile Details */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg mb-2 shadow-lg shadow-emerald-500/25 border border-emerald-500/30">
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

      {/* Segmented Filter Control */}
      <div className="flex bg-slate-100/80 border border-slate-200/50 p-1 rounded-xl mx-4 mt-4 shadow-inner">
        <button
          onClick={() => setTxFilter('ALL')}
          className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            txFilter === 'ALL' 
              ? 'bg-white text-slate-800 shadow-sm border border-slate-200/20' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setTxFilter('CREDIT')}
          className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            txFilter === 'CREDIT' 
              ? 'bg-red-500 text-white shadow-sm' 
              : 'text-slate-500 hover:text-red-600'
          }`}
        >
          UDHAR Diya (+)
        </button>
        <button
          onClick={() => setTxFilter('DEBIT')}
          className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            txFilter === 'DEBIT' 
              ? 'bg-green-600 text-white shadow-sm' 
              : 'text-slate-500 hover:text-green-600'
          }`}
        >
          PAISA Mila (-)
        </button>
      </div>

      {/* Transactions List */}
      <div className="px-4 py-4 flex-1">
        {filteredTxs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center mt-6 shadow-sm">
            <Calendar className="mx-auto text-slate-300 mb-2" size={32} />
            <h3 className="text-slate-700 font-semibold text-sm">No transactions found</h3>
            <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1">
              No matching records for this filter.
            </p>
          </div>
        ) : (
          Object.keys(groupedTxs).map(monthYear => (
            <div key={monthYear} className="mb-6">
              <div className="bg-slate-50 py-1.5 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
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
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
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
            className="flex items-center justify-center gap-1.5 py-3.5 px-4 bg-red-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} />
            <span>GIVE CREDIT (उधार दिया)</span>
          </button>

          {/* Receive Payment button */}
          <button
            onClick={() => onAddTransaction('DEBIT')}
            className="flex items-center justify-center gap-1.5 py-3.5 px-4 bg-green-600 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus size={16} />
            <span>GET PAYMENT (पैसा मिला)</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Template Selector Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-500" />
                <span>WhatsApp Reminder</span>
              </h3>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select Message Style:</p>
              
              {/* Template Option: Friendly */}
              <label className={`flex flex-col p-3 border rounded-2xl cursor-pointer transition-all ${
                selectedTemplate === 'friendly' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold text-slate-800">Friendly Reminder (अनुरोध)</span>
                  <input 
                    type="radio" 
                    name="template" 
                    value="friendly" 
                    checked={selectedTemplate === 'friendly'}
                    onChange={() => setSelectedTemplate('friendly')}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-600 leading-normal italic">
                  "{templates.friendly.substring(0, 80)}..."
                </p>
              </label>

              {/* Template Option: Professional */}
              <label className={`flex flex-col p-3 border rounded-2xl cursor-pointer transition-all ${
                selectedTemplate === 'professional' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold text-slate-800">Official Invoice (बिल विवरण)</span>
                  <input 
                    type="radio" 
                    name="template" 
                    value="professional" 
                    checked={selectedTemplate === 'professional'}
                    onChange={() => setSelectedTemplate('professional')}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-600 leading-normal italic">
                  "{templates.professional.substring(0, 80)}..."
                </p>
              </label>

              {/* Template Option: Urgent */}
              <label className={`flex flex-col p-3 border rounded-2xl cursor-pointer transition-all ${
                selectedTemplate === 'urgent' ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold text-slate-800">Urgent Notice (कड़ा संदेश)</span>
                  <input 
                    type="radio" 
                    name="template" 
                    value="urgent" 
                    checked={selectedTemplate === 'urgent'}
                    onChange={() => setSelectedTemplate('urgent')}
                    className="accent-emerald-500 cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-600 leading-normal italic">
                  "{templates.urgent.substring(0, 80)}..."
                </p>
              </label>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full mt-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Send to WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

