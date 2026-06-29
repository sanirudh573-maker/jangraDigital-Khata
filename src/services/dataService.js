import { supabase, isSupabaseConfigured } from '../supabaseClient'

// Generate mockup UUIDs
const mockUuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

// Seed default data for LocalStorage if not present
const seedLocalStorage = () => {
  if (!localStorage.getItem('khata_customers')) {
    const defaultCustomers = [
      { id: 'cust-1', name: 'Ramesh Kumar (Kirana)', phone: '9876543210', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'cust-2', name: 'Sunita Verma', phone: '9123456789', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'cust-3', name: 'Rajesh Sharma (Milk)', phone: '9988776655', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'cust-4', name: 'Vikram Singh (Dry Clean)', phone: '8877665544', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
    ]
    localStorage.setItem('khata_customers', JSON.stringify(defaultCustomers))
  }

  if (!localStorage.getItem('khata_transactions')) {
    const defaultTransactions = [
      // Ramesh Kumar
      { id: 'tx-1', customer_id: 'cust-1', amount: 4500, type: 'CREDIT', description: 'Monthly Grocery Udhar', created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tx-2', customer_id: 'cust-1', amount: 2000, type: 'DEBIT', description: 'Cash Paid (Partial)', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tx-3', customer_id: 'cust-1', amount: 1200, type: 'CREDIT', description: 'Sugar and Refined Oil', created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tx-4', customer_id: 'cust-1', amount: 1500, type: 'DEBIT', description: 'GPay payment', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      
      // Sunita Verma
      { id: 'tx-5', customer_id: 'cust-2', amount: 1500, type: 'CREDIT', description: 'Saree & Suits Udhar', created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tx-6', customer_id: 'cust-2', amount: 1500, type: 'DEBIT', description: 'Full Settlement Online', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      
      // Rajesh Sharma
      { id: 'tx-7', customer_id: 'cust-3', amount: 850, type: 'CREDIT', description: 'Milk & Paneer supply', created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tx-8', customer_id: 'cust-3', amount: 1000, type: 'DEBIT', description: 'Paid Advance Cash', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      
      // Vikram Singh
      { id: 'tx-9', customer_id: 'cust-4', amount: 1200, type: 'CREDIT', description: 'Coat and Blanket Dry cleaning', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ]
    localStorage.setItem('khata_transactions', JSON.stringify(defaultTransactions))
  }

  if (!localStorage.getItem('khata_items')) {
    const defaultItems = [
      // Products
      { id: 'item-1', name: 'Lakme Satin Lipstick', brand: 'Lakme', price: 350, stock: 15, type: 'product', created_at: new Date().toISOString() },
      { id: 'item-2', name: 'Nivea Soft Cream 200ml', brand: 'Nivea', price: 299, stock: 20, type: 'product', created_at: new Date().toISOString() },
      { id: 'item-3', name: 'Maybelline Fit Me Foundation', brand: 'Maybelline', price: 549, stock: 8, type: 'product', created_at: new Date().toISOString() },
      { id: 'item-4', name: 'L\'Oreal Paris Shampoo 340ml', brand: 'L\'Oreal', price: 399, stock: 12, type: 'product', created_at: new Date().toISOString() },
      { id: 'item-5', name: 'Pond\'s Dreamflower Talc 200g', brand: 'Pond\'s', price: 180, stock: 25, type: 'product', created_at: new Date().toISOString() },
      { id: 'item-6', name: 'Lotus Herbals Sunscreen SPF50', brand: 'Lotus', price: 425, stock: 10, type: 'product', created_at: new Date().toISOString() },
      { id: 'item-7', name: 'Mamaearth Onion Hair Oil 150ml', brand: 'Mamaearth', price: 399, stock: 14, type: 'product', created_at: new Date().toISOString() },
      // Parlour Services
      { id: 'item-srv-1', name: 'Bridal Makeup (ब्राइडल मेकअप)', brand: 'Parlour', price: 5000, stock: 0, type: 'service', created_at: new Date().toISOString() },
      { id: 'item-srv-2', name: 'Facial & Glow Treatment (फेशियल)', brand: 'Parlour', price: 800, stock: 0, type: 'service', created_at: new Date().toISOString() },
      { id: 'item-srv-3', name: 'Hair Cut & Styling (हेयर कट)', brand: 'Parlour', price: 350, stock: 0, type: 'service', created_at: new Date().toISOString() },
      { id: 'item-srv-4', name: 'Threading & Eyebrows (थ्रेडिंग)', brand: 'Parlour', price: 50, stock: 0, type: 'service', created_at: new Date().toISOString() },
      { id: 'item-srv-5', name: 'Manicure & Pedicure (मैनिक्योर)', brand: 'Parlour', price: 600, stock: 0, type: 'service', created_at: new Date().toISOString() }
    ]
    localStorage.setItem('khata_items', JSON.stringify(defaultItems))
  }
}

// Initialize seed data if using local mode
if (!isSupabaseConfigured) {
  seedLocalStorage()
}

export const dataService = {
  // --- Customers ---
  async getCustomers() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      return data
    } else {
      const customers = JSON.parse(localStorage.getItem('khata_customers') || '[]')
      return customers.sort((a, b) => a.name.localeCompare(b.name))
    }
  },

  async addCustomer(name, phone) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('customers')
        .insert([{ name, phone }])
        .select()
        .single()
      if (error) throw error
      return data
    } else {
      const customers = JSON.parse(localStorage.getItem('khata_customers') || '[]')
      const newCustomer = {
        id: 'cust-' + mockUuid(),
        name,
        phone,
        created_at: new Date().toISOString()
      }
      customers.push(newCustomer)
      localStorage.setItem('khata_customers', JSON.stringify(customers))
      return newCustomer
    }
  },

  async deleteCustomer(id) {
    if (isSupabaseConfigured) {
      // First delete associated transactions
      const { error: txError } = await supabase
        .from('transactions')
        .delete()
        .eq('customer_id', id)
      if (txError) throw txError

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
      if (error) throw error
      return true
    } else {
      const customers = JSON.parse(localStorage.getItem('khata_customers') || '[]')
      const transactions = JSON.parse(localStorage.getItem('khata_transactions') || '[]')
      
      const filteredCustomers = customers.filter(c => c.id !== id)
      const filteredTransactions = transactions.filter(t => t.customer_id !== id)
      
      localStorage.setItem('khata_customers', JSON.stringify(filteredCustomers))
      localStorage.setItem('khata_transactions', JSON.stringify(filteredTransactions))
      return true
    }
  },

  // --- Transactions ---
  async getTransactions(customerId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('transactions').select('*').order('created_at', { ascending: false })
      if (customerId) {
        query = query.eq('customer_id', customerId)
      }
      const { data, error } = await query
      if (error) throw error
      return data
    } else {
      const transactions = JSON.parse(localStorage.getItem('khata_transactions') || '[]')
      const filtered = customerId 
        ? transactions.filter(t => t.customer_id === customerId)
        : transactions
      return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  },

  async addTransaction(customerId, amount, type, description) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ 
          customer_id: customerId, 
          amount: parseFloat(amount), 
          type, 
          description: description || (type === 'CREDIT' ? 'Udhar Diya' : 'Paisa Mila')
        }])
        .select()
        .single()
      if (error) throw error
      return data
    } else {
      const transactions = JSON.parse(localStorage.getItem('khata_transactions') || '[]')
      const newTx = {
        id: 'tx-' + mockUuid(),
        customer_id: customerId,
        amount: parseFloat(amount),
        type,
        description: description || (type === 'CREDIT' ? 'Udhar Diya' : 'Paisa Mila'),
        created_at: new Date().toISOString()
      }
      transactions.push(newTx)
      localStorage.setItem('khata_transactions', JSON.stringify(transactions))
      return newTx
    }
  },

  async deleteTransaction(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      if (error) throw error
      return true
    } else {
      const transactions = JSON.parse(localStorage.getItem('khata_transactions') || '[]')
      const filtered = transactions.filter(t => t.id !== id)
      localStorage.setItem('khata_transactions', JSON.stringify(filtered))
      return true
    }
  },

  // --- Cosmetics Items ---
  async getItems() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('name', { ascending: true })
        if (error) throw error
        return data
      } catch (err) {
        console.warn("Supabase 'items' table might not be created yet. Falling back to LocalStorage:", err.message)
        const items = JSON.parse(localStorage.getItem('khata_items') || '[]')
        return items.sort((a, b) => a.name.localeCompare(b.name))
      }
    } else {
      const items = JSON.parse(localStorage.getItem('khata_items') || '[]')
      return items.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  async addItem(name, brand, price, stock, type = 'product') {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('items')
          .insert([{ 
            name, 
            brand: brand || '', 
            price: parseFloat(price), 
            stock: type === 'product' ? (parseInt(stock) || 0) : 0,
            type
          }])
          .select()
          .single()
        if (error) throw error
        return data
      } catch (err) {
        console.warn("Failed to add item to Supabase, falling back to LocalStorage:", err.message)
        const items = JSON.parse(localStorage.getItem('khata_items') || '[]')
        const newItem = {
          id: 'item-' + mockUuid(),
          name,
          brand: brand || '',
          price: parseFloat(price),
          stock: type === 'product' ? (parseInt(stock) || 0) : 0,
          type,
          created_at: new Date().toISOString()
        }
        items.push(newItem)
        localStorage.setItem('khata_items', JSON.stringify(items))
        return newItem
      }
    } else {
      const items = JSON.parse(localStorage.getItem('khata_items') || '[]')
      const newItem = {
        id: 'item-' + mockUuid(),
        name,
        brand: brand || '',
        price: parseFloat(price),
        stock: type === 'product' ? (parseInt(stock) || 0) : 0,
        type,
        created_at: new Date().toISOString()
      }
      items.push(newItem)
      localStorage.setItem('khata_items', JSON.stringify(items))
      return newItem
    }
  },

  async deleteItem(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('items')
          .delete()
          .eq('id', id)
        if (error) throw error
        return true
      } catch (err) {
        console.warn("Failed to delete item from Supabase, falling back to LocalStorage:", err.message)
        const items = JSON.parse(localStorage.getItem('khata_items') || '[]')
        const filtered = items.filter(i => i.id !== id)
        localStorage.setItem('khata_items', JSON.stringify(filtered))
        return true
      }
    } else {
      const items = JSON.parse(localStorage.getItem('khata_items') || '[]')
      const filtered = items.filter(i => i.id !== id)
      localStorage.setItem('khata_items', JSON.stringify(filtered))
      return true
    }
  }
}
