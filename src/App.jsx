import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import ItemDetail from './pages/ItemDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Testimonials from './pages/Testimonials.jsx'
import FAQ from './pages/FAQ.jsx'
import Location from './pages/Location.jsx'
import Careers from './pages/Careers.jsx'
import Catering from './pages/Catering.jsx'
import Events from './pages/Events.jsx'
import GiftCards from './pages/GiftCards.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Terms from './pages/Terms.jsx'
import PrivacyPolicy from './pages/Privacy.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="site">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:category/:slug" element={<ItemDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/location" element={<Location />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App