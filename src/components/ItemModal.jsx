import React, { useState } from 'react'
import { X, Check, Sparkles, Tag, Archive, Scissors } from 'lucide-react'

const SUGGESTED_BRANDS = ['Lakme', 'Maybelline', 'Nivea', 'Pond\'s', 'L\'Oreal', 'Lotus', 'Mamaearth', 'Parlour']

export default function ItemModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [type, setType] = useState('product') // 'product' or 'service'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required.')
      return
    }

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than 0.')
      return
    }

    const parsedStock = type === 'product' ? (parseInt(stock) || 0) : 0
    if (type === 'product' && parsedStock < 0) {
      setError('Stock cannot be negative.')
      return
    }

    try {
      setLoading(true)
      await onSubmit({
        name: name.trim(),
        brand: brand.trim() || (type === 'service' ? 'Parlour' : ''),
        price: parsedPrice,
        stock: parsedStock,
        type
      })
      // Reset
      setName('')
      setBrand('')
      setPrice('')
      setStock('')
      setType('product')
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-100 p-6 z-10 transition-transform transform translate-y-0 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles size={16} className="text-emerald-600 animate-pulse" />
              <span>Add to Catalog</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Add a product or beauty parlour service</p>
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

          {/* Type Selector (Product vs Service) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Catalog Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('product')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  type === 'product'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Product (सामान)
              </button>
              <button
                type="button"
                onClick={() => setType('service')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  type === 'service'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Parlour Service (सेवा)
              </button>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {type === 'product' ? 'Product Name' : 'Service Name'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                {type === 'product' ? <Sparkles size={16} /> : <Scissors size={16} />}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'product' ? 'e.g. Lakme Matte Lipstick' : 'e.g. Bridal Makeup / Facial'}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Brand Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {type === 'product' ? 'Brand Name' : 'Category / Salon Name'}
            </label>
            <div className="relative mb-2">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Tag size={16} />
              </span>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={type === 'product' ? 'e.g. Lakme' : 'e.g. Parlour / Bridal'}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
            
            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {SUGGESTED_BRANDS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBrand(item)}
                  className="text-[9px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded border border-slate-200/40 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div className={type === 'product' ? 'grid grid-cols-2 gap-3' : 'w-full'}>
            {/* MRP Price */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {type === 'product' ? 'MRP Price (₹)' : 'Service Price / Fee (₹)'}
              </label>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
                min="1"
                step="any"
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>

            {/* Current Stock (Only for Products) */}
            {type === 'product' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Archive size={11} />
                  <span>Initial Stock</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 10"
                  min="0"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check size={16} />
                  <span>{type === 'product' ? 'Add To Inventory' : 'Add Parlour Service'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
