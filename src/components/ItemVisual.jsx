import Illustration from './Illustrations.jsx'

// Add an `image` field to any item in src/data/menu.js (e.g.
// image: '/src/assets/pistachio-rose-cake.jpg') and it shows up here
// automatically — no other code changes needed. Items without an `image`
// field keep using the drawn illustration.
function ItemVisual({ item, className = '' }) {
  if (item.image) {
    return (
      <div className={`item-visual ${className}`}>
        <img src={item.image} alt={item.name} />
      </div>
    )
  }

  return <Illustration type={item.illustration} variant={item.variant} className={className} />
}

export default ItemVisual
