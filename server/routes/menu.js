import { Router } from 'express'
import { categories, subcategories, products, nextId } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { stockFor, ensureStock, removeStock } from '../services/stockService.js'

const router = Router()
const adminOnly = [requireAuth, requireRole('admin')]

// Public: anyone can read the menu
router.get('/menu', (req, res) => {
  res.json({
    categories,
    subcategories,
    products: products.map((p) => ({
      ...p,
      in_stock: (stockFor(p.product_id)?.quantity || 0) > 0,
    })),
  })
})

// ---------- Categories ----------
router.post('/categories', ...adminOnly, (req, res) => {
  const name = (req.body.name || '').trim()
  const tagline = (req.body.tagline || '').trim()

  if (!name) return res.status(400).json({ message: 'Category name is required' })
  if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ message: 'This category already exists' })
  }

  const category = { category_id: nextId(categories, 'category_id', 1001), name, tagline }
  categories.push(category)
  res.status(201).json(category)
})

router.delete('/categories/:id', ...adminOnly, (req, res) => {
  const id = Number(req.params.id)
  const index = categories.findIndex((c) => c.category_id === id)

  if (index === -1) return res.status(404).json({ message: 'Category not found' })
  if (subcategories.some((s) => s.category_id === id)) {
    return res.status(409).json({ message: 'Remove this category\'s sub categories first' })
  }

  categories.splice(index, 1)
  res.json({ message: 'Category removed' })
})

// ---------- Sub categories ----------
router.post('/subcategories', ...adminOnly, (req, res) => {
  const name = (req.body.name || '').trim()
  const category_id = Number(req.body.category_id)

  if (!name) return res.status(400).json({ message: 'Sub category name is required' })
  if (!categories.some((c) => c.category_id === category_id)) {
    return res.status(400).json({ message: 'Choose a valid category' })
  }

  const subcategory = {
    subcategory_id: nextId(subcategories, 'subcategory_id', 1101),
    category_id,
    name,
  }
  subcategories.push(subcategory)
  res.status(201).json(subcategory)
})

router.delete('/subcategories/:id', ...adminOnly, (req, res) => {
  const id = Number(req.params.id)
  const index = subcategories.findIndex((s) => s.subcategory_id === id)

  if (index === -1) return res.status(404).json({ message: 'Sub category not found' })
  if (products.some((p) => p.subcategory_id === id)) {
    return res.status(409).json({ message: 'Remove this sub category\'s products first' })
  }

  subcategories.splice(index, 1)
  res.json({ message: 'Sub category removed' })
})

// ---------- Products ----------
router.post('/products', ...adminOnly, (req, res) => {
  const name = (req.body.name || '').trim()
  const price = Number(req.body.price)
  const subcategory_id = Number(req.body.subcategory_id)

  if (!name) return res.status(400).json({ message: 'Product name is required' })
  if (!Number.isFinite(price) || price <= 0) {
    return res.status(400).json({ message: 'Price must be a number above 0' })
  }
  if (!subcategories.some((s) => s.subcategory_id === subcategory_id)) {
    return res.status(400).json({ message: 'Choose a valid sub category' })
  }

  const product = {
    product_id: nextId(products, 'product_id', 2001),
    subcategory_id,
    name,
    price,
    short_note: (req.body.short_note || '').trim(),
    description: (req.body.description || '').trim(),
  }
  products.push(product)
  ensureStock(product.product_id)
  res.status(201).json(product)
})

router.delete('/products/:id', ...adminOnly, (req, res) => {
  const id = Number(req.params.id)
  const index = products.findIndex((p) => p.product_id === id)

  if (index === -1) return res.status(404).json({ message: 'Product not found' })

  products.splice(index, 1)
  removeStock(id)
  res.json({ message: 'Product removed' })
})

export default router