import { stock } from '../data/store.js'

let nextStockId = 6613

export function stockFor(productId) {
  return stock.find((row) => row.product_id === productId)
}

// Every product gets a stock row, starting at 0
export function ensureStock(productId) {
  let row = stockFor(productId)
  if (!row) {
    row = {
      stock_id: nextStockId++,
      product_id: productId,
      quantity: 0,
      reorder_level: 5,
      updated_at: new Date().toISOString(),
    }
    stock.push(row)
  }
  return row
}

// Use a negative amount to take stock out
export function addStock(productId, amount) {
  const row = ensureStock(productId)
  row.quantity += amount
  row.updated_at = new Date().toISOString()
}

export function removeStock(productId) {
  const index = stock.findIndex((row) => row.product_id === productId)
  if (index !== -1) stock.splice(index, 1)
}