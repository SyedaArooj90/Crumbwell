import legacyMenu from '../data/menu.js'

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Photos and drawings still come from menu.js, matched by slug
const extras = {}
Object.values(legacyMenu).forEach((category) => {
  category.items.forEach((item) => {
    extras[item.slug] = {
      image: item.image,
      illustration: item.illustration,
      variant: item.variant,
    }
  })
})

const fallbackIllustration = {
  cakes: 'cake',
  pastries: 'pastry',
  breads: 'bread',
  beverages: 'beverage',
}

export function buildItems(menu) {
  return menu.products.map((product) => {
    const sub = menu.subcategories.find((s) => s.subcategory_id === product.subcategory_id)
    const category = menu.categories.find((c) => c.category_id === sub?.category_id)
    const slug = slugify(product.name)
    const extra = extras[slug] || {}
    const categoryKey = category ? slugify(category.name) : ''

    return {
      product_id: product.product_id,
      slug,
      name: product.name,
      price: `Rs ${product.price}`,
      priceValue: product.price,
      shortNote: product.short_note,
      description: product.description,
      inStock: product.in_stock !== false,
      image: extra.image,
      illustration: extra.illustration || fallbackIllustration[categoryKey] || 'cake',
      variant: extra.variant || 1,
      categoryId: category?.category_id,
      categoryKey,
      categoryName: category?.name,
      subcategoryId: product.subcategory_id,
      subcategoryName: sub?.name,
    }
  })
}