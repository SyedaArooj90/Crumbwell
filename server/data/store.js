import bcrypt from 'bcryptjs'

export const users = [
  {
    user_id: 101,
    name: 'Admin',
    email: 'admin@crumbwell.pk',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    user_id: 102,
    name: 'Owner',
    email: 'owner@crumbwell.pk',
    password_hash: bcrypt.hashSync('owner123', 10),
    role: 'owner',
  },
  {
    user_id: 103,
    name: 'Sales Person',
    email: 'sales@crumbwell.pk',
    password_hash: bcrypt.hashSync('sales123', 10),
    role: 'salesperson',
  },
]

let nextUserId = 104
export function newUserId() {
  return nextUserId++
}

export function nextId(list, key, start) {
  return list.length ? Math.max(...list.map((row) => row[key])) + 1 : start
}

export const categories = [
  { category_id: 1001, name: 'Cakes', tagline: 'Slices and whole cakes, made to order' },
  { category_id: 1002, name: 'Pastries', tagline: 'Laminated dough, baked fresh each morning' },
  { category_id: 1003, name: 'Breads', tagline: 'Slow-fermented, baked daily from four in the morning' },
  { category_id: 1004, name: 'Beverages', tagline: 'Made to order, to go with anything on the menu' },
]

export const subcategories = [
  { subcategory_id: 1101, category_id: 1001, name: 'Layer Cakes' },
  { subcategory_id: 1102, category_id: 1001, name: 'Tarts' },
  { subcategory_id: 1103, category_id: 1002, name: 'Buns' },
  { subcategory_id: 1104, category_id: 1002, name: 'Croissants and Danish' },
  { subcategory_id: 1105, category_id: 1003, name: 'Sourdough and Rye' },
  { subcategory_id: 1106, category_id: 1003, name: 'Soft Breads' },
  { subcategory_id: 1107, category_id: 1004, name: 'Hot Drinks' },
  { subcategory_id: 1108, category_id: 1004, name: 'Cold Drinks' },
]

export const products = [
  { product_id: 2001, subcategory_id: 1101, name: 'Pistachio & Rose Cake', price: 380, short_note: 'Real rose water, order whole by request', description: 'Layers of pistachio sponge with a light rose buttercream.' },
  { product_id: 2002, subcategory_id: 1102, name: 'Dark Chocolate Tart', price: 350, short_note: 'Sea salt, 70% cocoa', description: 'Buttery crust filled with dark chocolate ganache.' },
  { product_id: 2003, subcategory_id: 1101, name: 'Carrot Walnut Cake', price: 320, short_note: 'Brown butter cream cheese', description: 'Spiced carrot cake with toasted walnuts.' },
  { product_id: 2004, subcategory_id: 1103, name: 'Cardamom Morning Bun', price: 250, short_note: 'Laminated, brown-butter filling', description: 'Rolled with brown butter and cardamom.' },
  { product_id: 2005, subcategory_id: 1104, name: 'Almond Croissant', price: 320, short_note: 'Twice-baked, frangipane center', description: 'Twice-baked with almond frangipane.' },
  { product_id: 2006, subcategory_id: 1104, name: 'Pistachio Danish', price: 300, short_note: 'Rose glaze, crushed pistachio', description: 'Pinwheel danish with pistachio cream.' },
  { product_id: 2007, subcategory_id: 1105, name: 'Country Sourdough', price: 650, short_note: '36-hour ferment, whole wheat crust', description: 'Our house loaf with a deep, tangy flavor.' },
  { product_id: 2008, subcategory_id: 1105, name: 'Seeded Rye', price: 700, short_note: 'Flax, sunflower, and caraway', description: 'Dense dark rye loaded with seeds.' },
  { product_id: 2009, subcategory_id: 1106, name: 'Milk Bread Loaf', price: 450, short_note: 'Soft crumb, tangzhong method', description: 'Soft, faintly sweet white loaf.' },
  { product_id: 2010, subcategory_id: 1107, name: 'Filter Coffee', price: 200, short_note: 'Slow-poured, single origin', description: 'Hand-poured filter coffee.' },
  { product_id: 2011, subcategory_id: 1107, name: 'Masala Chai', price: 150, short_note: 'House spice blend, simmered slow', description: 'Black tea simmered with milk and spices.' },
  { product_id: 2012, subcategory_id: 1108, name: 'Rose Lemonade', price: 220, short_note: 'Fresh lemon, rose syrup, mint', description: 'Fresh lemonade with house rose syrup.' },
]

export const employees = [
  { employee_id: 6701, name: 'Ayesha Khan', role: 'Baker', phone: '0300-1234567', join_date: '2025-03-01', active: true },
]

export const salaryPayments = []

export const suppliers = [
  { supplier_id: 6501, name: 'Multan Flour Mills', contact_number: '061-1112223' },
  { supplier_id: 6502, name: 'Fresh Dairy Co.', contact_number: '061-2223334' },
  { supplier_id: 6503, name: 'Punjab Nut Traders', contact_number: '061-3334445' },
]



// One stock row per product. Seeded Rye starts low so you can see the warning.
export const stock = products.map((product, index) => ({
  stock_id: 6601 + index,
  product_id: product.product_id,
  quantity: product.product_id === 2008 ? 4 : 30,
  reorder_level: 5,
  updated_at: new Date().toISOString(),
}))

export const purchaseOrders = []
export const purchaseOrderItems = []

export const carts = []
export const cartItems = []
export const orders = []
export const orderItems = []
export const bills = []