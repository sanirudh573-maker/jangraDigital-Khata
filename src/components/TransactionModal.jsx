import React, { useState, useEffect } from 'react'
import { X, Check, IndianRupee, MessageSquare } from 'lucide-react'

const QUICK_DESCRIPTIONS = {
  CREDIT: ['Kirana Udhar', 'Milk Supply', 'Dry Clean', 'Vegetables', 'Monthly Bill', 'Other Goods'],
  DEBIT: ['Cash Paid', 'GPay Payment', 'PhonePe', 'Paytm', 'Online Transfer', 'Settlement']
}

export default function TransactionModal({ isOpen, onClose, onSubmit, type: initialType, customerName, items = [] }) {
  const [type, setType] = useState(initialType || 'CREDIT')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Item Picker States
  const [selectedItemId, setSelectedItemId] = useState('')
  const [selectedQty, setSelectedQty] = useState(1)
  const [showItemSelect, setShowItemSelect] = useState(false)

  // Sync initial type when modal opens
  useEffect(() => {
    if (initialType) {
      setType(initialType)
    }
  }, [initialType, isOpen])

  const handleAddItemToBill = () => {
    if (!selectedItemId) return
    const targetItem = items.find(i => i.id === selectedItemId)
    if (!targetItem) return

    const qty = parseInt(selectedQty) || 1
    const cost = targetItem.price * qty

    // Update amount
    const currentAmt = parseFloat(amount) || 0
    setAmount((currentAmt + cost).toFixed(2))

    // Update description
    const itemLabel = `${qty}x ${targetItem.name}`
    if (description.trim()) {
      setDescription(description.trim() + ', ' + itemLabel)
    } else {
      setDescription(itemLabel)
    }

    // Reset item inputs
    setSelectedItemId('')
    setSelectedQty(1)
    setShowItemSelect(false)
  }

  if (!isOpen) return null

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    try {
      setLoading(true)
      await onSubmit({
        amount: parsedAmount,
        type,
        description: description.trim()
      })
      // Reset and close
      setAmount('')
      setDescription('')
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to record transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isCredit = type === 'CREDIT'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-100 p-6 z-10 transition-all transform translate-y-0 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isCredit ? 'Give Credit (उधार दिया)' : 'Receive Payment (पैसा मिला)'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Recording ledger transaction for <span className="font-semibold text-slate-600">{customerName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Toggle Type in Modal (Double check) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('CREDIT')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                isCredit 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Udhar Diya (Credit)
            </button>
            <button
              type="button"
              onClick={() => setType('DEBIT')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                !isCredit 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Paisa Mila (Debit)
            </button>
          </div>

          {/* Cosmetics Item Picker (Only visible for CREDIT / Udhar Diya) */}
          {isCredit && items.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} className="text-emerald-500 animate-pulse" />
                  <span>Choose Cosmetics Items</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowItemSelect(!showItemSelect)}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 underline transition-all cursor-pointer"
                >
                  {showItemSelect ? 'Cancel' : '+ Add Item'}
                </button>
              </div>

              {showItemSelect && (
                <div className="space-y-2 mt-2 pt-2 border-t border-slate-200/50">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <select
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
                      >
                        <option value="">-- Choose Item --</option>
                        {items.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} (₹{item.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={selectedQty}
                        onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItemToBill}
                    disabled={!selectedItemId}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Add to Bill
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Amount Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Transaction Amount (₹)
            </label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-sm ${
                isCredit ? 'text-red-500' : 'text-green-500'
              }`}>
                <IndianRupee size={16} />
              </span>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="0.01"
                step="any"
                disabled={loading}
                className={`w-full pl-9 pr-4 py-3 bg-slate-50 border rounded-xl text-lg font-extrabold focus:outline-none focus:ring-2 focus:bg-white text-slate-900 transition-all ${
                  isCredit 
                    ? 'border-red-100 focus:ring-red-500' 
                    : 'border-green-100 focus:ring-green-500'
                }`}
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Description / Remarks
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <MessageSquare size={16} />
              </span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isCredit ? 'e.g. Rice and wheat bag' : 'e.g. Cash payment'}
                disabled={loading}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:bg-white text-slate-900 transition-all ${
                  isCredit 
                    ? 'border-red-100 focus:ring-red-500' 
                    : 'border-green-100 focus:ring-green-500'
                }`}
              />
            </div>

            {/* Quick Description Chips */}
            <div className="mt-2.5">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">Quick Options:</span>
              <div className="flex flex-wrap gap-1.5">
                {(isCredit ? QUICK_DESCRIPTIONS.CREDIT : QUICK_DESCRIPTIONS.DEBIT).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setDescription(chip)}
                    className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/40 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg ${
                isCredit 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                  : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Transaction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
