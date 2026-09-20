// All menu content lives here. Add a new item by adding an object to the
// right category's `items` array — every page (category list, item detail,
// even the homepage highlights) reads from this one file.
//
// Fields per item:
//   slug         - used in the URL, e.g. "pistachio-rose-cake"
//   name         - display name
//   price        - shown as text, e.g. "Rs 380 / slice"
//   shortNote    - one line, shown on the category grid
//   description  - longer text, shown on the item's own page
//   illustration - which illustration to draw: "cake", "pastry", "bread",
//                  or "beverage" (see src/components/Illustrations.jsx)
//   variant      - 1, 2, or 3 — picks a color/shape variation so items in
//                  the same category don't all look identical

const menu = {
  cakes: {
    label: 'Cakes',
    tagline: 'Slices and whole cakes, made to order',
    illustration: 'cake',
    items: [
      {
        slug: 'pistachio-rose-cake',
        name: 'Pistachio & Rose Cake',
        price: 'Rs 380 / slice',
        shortNote: 'Real rose water, order whole by request',
        description:
          'Our most requested celebration slice. Layers of pistachio sponge with a light rose buttercream, finished with crushed pistachio and a few dried rose petals. Whole cakes are available with two days notice.',
        illustration: 'cake',
        variant: 1,
        image: 'src/assets/pistachio-rose-cake.webp',
      },
      {
        slug: 'dark-chocolate-tart',
        name: 'Dark Chocolate Tart',
        price: 'Rs 350 / slice',
        shortNote: 'Sea salt, 70% cocoa',
        description:
          'A short, buttery crust filled with dark chocolate ganache and finished with flaked sea salt. Rich, not overly sweet, best served slightly chilled.',
        illustration: 'cake',
        variant: 2,
        image: 'src/assets/dark-chocolate-tart1.jpg',
      },
      {
        slug: 'carrot-walnut-cake',
        name: 'Carrot Walnut Cake',
        price: 'Rs 320 / slice',
        shortNote: 'Brown butter cream cheese',
        description:
          'Spiced carrot cake with toasted walnuts through the crumb, layered with a brown butter cream cheese frosting. A quieter cake, but the one regulars keep asking for.',
        illustration: 'cake',
        variant: 3,
        image: 'src/assets/carrot-walnut-cake.jpg',
      },
    ],
  },
  pastries: {
    label: 'Pastries',
    tagline: 'Laminated dough, baked fresh each morning',
    illustration: 'pastry',
    items: [
      {
        slug: 'cardamom-morning-bun',
        name: 'Cardamom Morning Bun',
        price: 'Rs 250',
        shortNote: 'Laminated, brown-butter filling',
        description:
          'A cinnamon-bun cousin, laminated like a croissant and rolled with a brown butter and cardamom filling, then finished with raw sugar for a shattering top.',
        illustration: 'pastry',
        variant: 1,
        image: 'src/assets/cardamon-morning-bun.jpg'
      },
      {
        slug: 'almond-croissant',
        name: 'Almond Croissant',
        price: 'Rs 320',
        shortNote: 'Twice-baked, frangipane center',
        description:
          'Day-old croissants twice-baked with almond frangipane, topped with sliced almonds and a dusting of powdered sugar. Rich enough to share, though most people don\'t.',
        illustration: 'pastry',
        variant: 2,
        image: 'src/assets/almond-croissant.jpg'
      },
      {
        slug: 'pistachio-danish',
        name: 'Pistachio Danish',
        price: 'Rs 300',
        shortNote: 'Rose glaze, crushed pistachio',
        description:
          'A pinwheel danish with a light pistachio cream center, finished with a thin rose glaze and crushed pistachio. One of the first to sell out on weekends.',
        illustration: 'pastry',
        variant: 3,
        image: 'src/assets/pistacio-danish.jpg'
      },
    ],
  },
  breads: {
    label: 'Breads',
    tagline: 'Slow-fermented, baked daily from four in the morning',
    illustration: 'bread',
    items: [
      {
        slug: 'country-sourdough',
        name: 'Country Sourdough',
        price: 'Rs 650',
        shortNote: '36-hour ferment, whole wheat crust',
        description:
          'Our house loaf. A 36-hour cold ferment gives it a deep, slightly tangy flavor, a dark crust, and an open crumb. Usually gone by ten in the morning.',
        illustration: 'bread',
        variant: 1,
        image: 'src/assets/country-sourdough.jpg'
      },
      {
        slug: 'seeded-rye',
        name: 'Seeded Rye',
        price: 'Rs 700',
        shortNote: 'Flax, sunflower, and caraway',
        description:
          'A dense, dark rye loaded with flax, sunflower seeds, and a touch of caraway. Keeps well for days and gets better toasted.',
        illustration: 'bread',
        variant: 2,
        image: 'src/assets/seeded-rye.jpg'
      },
      {
        slug: 'milk-bread-loaf',
        name: 'Milk Bread Loaf',
        price: 'Rs 450',
        shortNote: 'Soft crumb, tangzhong method',
        description:
          'A soft, faintly sweet white loaf made with the tangzhong method for an especially tender crumb. A favorite for sandwiches and toast alike.',
        illustration: 'bread',
        variant: 3,
        image: 'src/assets/milk-bread.jpg'
      },
    ],
  },
  beverages: {
    label: 'Beverages',
    tagline: 'Made to order, to go with anything on the menu',
    illustration: 'beverage',
    items: [
      {
        slug: 'filter-coffee',
        name: 'Filter Coffee',
        price: 'Rs 200',
        shortNote: 'Slow-poured, single origin',
        description:
          'A slow hand-poured filter coffee using a rotating single-origin bean. Ask what we\'re pouring this week.',
        illustration: 'beverage',
        variant: 1,
        image: 'src/assets/filter-coffee.jpg'
      },
      {
        slug: 'masala-chai',
        name: 'Masala Chai',
        price: 'Rs 150',
        shortNote: 'House spice blend, simmered slow',
        description:
          'Black tea simmered with milk and our own spice blend of cardamom, ginger, and clove. Best paired with the cardamom morning bun.',
        illustration: 'beverage',
        variant: 2,
        image: 'src/assets/masala-chai.jpg'
      },
      {
        slug: 'rose-lemonade',
        name: 'Rose Lemonade',
        price: 'Rs 220',
        shortNote: 'Fresh lemon, rose syrup, mint',
        description:
          'Fresh-squeezed lemonade with a house rose syrup and a sprig of mint. Served over ice, a favorite in the warmer months.',
        illustration: 'beverage',
        variant: 3,
        image: 'src/assets/rose-lemonade.jpg'
      },
    ],
  },
}

export default menu
