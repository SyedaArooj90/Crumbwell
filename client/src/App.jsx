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
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminCategories from './pages/AdminCategories.jsx'
import AdminSubcategories from './pages/AdminSubcategories.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import AdminStock from './pages/AdminStock.jsx'
import AdminSuppliers from './pages/AdminSuppliers.jsx'
import AdminPurchases from './pages/AdminPurchases.jsx'
import AdminCounter from './pages/AdminCounter.jsx'
import AdminReports from './pages/AdminReports.jsx'
import AdminEmployees from './pages/AdminEmployees.jsx'

function App() {
  return (
    <div className="site">
      <Navbar />
      <main>
        <Routes>
          <Route path="/admin"element={<ProtectedRoute roles={['admin', 'owner', 'salesperson']}><AdminDashboard /> </ProtectedRoute>} />
          <Route path="/admin/categories"element={<ProtectedRoute roles={['admin']}><AdminCategories /></ProtectedRoute>}/>
          <Route path="/admin/subcategories"element={<ProtectedRoute roles={['admin']}><AdminSubcategories /></ProtectedRoute>}/>
          <Route path="/admin/products"element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>}/>        
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
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route
  path="/admin/employees"
  element={
    <ProtectedRoute roles={['admin', 'owner']}>
      <AdminEmployees />
    </ProtectedRoute>
  }
/>
          <Route
  path="/admin/reports"
  element={<ProtectedRoute roles={['admin', 'owner']}><AdminReports /></ProtectedRoute>}
/>
          <Route
  path="/admin/stock"
  element={<ProtectedRoute roles={['admin', 'owner']}><AdminStock /></ProtectedRoute>}
/>
<Route
  path="/admin/suppliers"
  element={<ProtectedRoute roles={['admin', 'owner']}><AdminSuppliers /></ProtectedRoute>}
/>
<Route
  path="/admin/purchases"
  element={<ProtectedRoute roles={['admin', 'owner']}><AdminPurchases /></ProtectedRoute>}
/>
          <Route
  path="/admin/orders"
  element={
    <ProtectedRoute roles={['admin', 'owner', 'salesperson']}>
      <AdminOrders />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/counter"
  element={<ProtectedRoute roles={['admin', 'owner', 'salesperson']}><AdminCounter /></ProtectedRoute>}
/>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App