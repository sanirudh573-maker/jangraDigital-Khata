import React, { useState } from 'react'
import { Search, Sparkles, Tag, Archive, Trash2, Plus } from 'lucide-react'

// Brand color maps for cosmetics
const BRAND_COLORS = {
  lakme: 'bg-rose-50 text-rose-600 border-rose-100',
  nivea: 'bg-blue-50 text-blue-600 border-blue-100',
  maybelline: 'bg-purple-50 text-purple-600 border-purple-100',
  loreal: 'bg-amber-50 text-amber-600 border-amber-100',
  "l'oreal": 'bg-amber-50 text-amber-600 border-amber-100',
  ponds: 'bg-sky-50 text-sky-600 border-sky-100',
  "pond's": 'bg-sky-50 text-sky-600 border-sky-100',
  lotus: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  mamaearth: 'bg-lime-50 text-lime-600 border-lime-100'
}

export default function ItemsList({ items, onDeleteItem }) {
  const [searchQuery, setSearchQuery] = useState('')

  const getBrandBadgeClass = (brand) => {
    const key = brand.toLowerCase().trim()
    return BRAND_COLORS[key] || 'bg-slate-50 text-slate-600 border-slate-100'
  }

  // Filter items by search
  const filteredItems = items.filter(item => {
    const term = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(term) ||
      (item.brand && item.brand.toLowerCase().includes(term))
    )
  })

  return (
    <div className="max-w-md mx-auto px-4 py-4 mb-24">
      {/* Search Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search cosmetics (lipstick, cream)..."
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

      {/* Header Info */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Cosmetics Inventory ({filteredItems.length})
        </h2>
        <span className="text-[10px] text-slate-400">Jangra Store Collection</span>
      </div>

      {/* Items Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles size={24} />
          </div>
          <h3 className="text-slate-800 font-semibold mb-1">No items found</h3>
          <p className="text-xs text-slate-500 max-w-[240px] mx-auto">
            {searchQuery 
              ? "No items match your search. Try checking spelling." 
              : "Click the '+' button below to add your first cosmetic item to the catalog."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => {
            const lowStock = item.stock <= 5

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-400 to-emerald-400 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.brand && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${getBrandBadgeClass(item.brand)}`}>
                          {item.brand.toUpperCase()}
                        </span>
                      )}
                      
                      <span className={`text-[9px] font-semibold flex items-center gap-0.5 ${
                        lowStock ? 'text-rose-500' : 'text-slate-400'
                      }`}>
                        <Archive size={9} />
                        <span>{item.stock} in stock</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Delete */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">MRP Price</span>
                    <span className="text-sm font-extrabold text-emerald-600">₹{item.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${item.name} from catalog?`)) {
                        onDeleteItem(item.id)
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
