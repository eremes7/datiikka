import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navibar from './components/Navibar'
import FrontPage from './pages/FrontPage'
import ShelfConfigurator from './pages/Three'
import Products from './pages/Products'
import Info from './pages/Info'
import EetuHylly from "./pages/productPages/Eetu-Hylly"
import BasketSidebar from './pages/shoppingBasket/BasketSidebar'
import Checkout from './pages/shoppingBasket/Checkout.jsx'

const navItems = [
  { to: '/',                  label: 'Etusivu' },
  { to: '/products',          label: 'Tuotteet' },
  { to: '/shelfconfigurator', label: 'Rakenna hylly' },
  { to: '/info',          label: 'Tietoa' },
]

function App() {
  return (
    <BrowserRouter>
      <BasketSidebar />
      <Navibar items={navItems} />
      <main className="pt-16 p-4">
        <Routes>
          <Route path="/"                element={<FrontPage />} />
          <Route path="/shelfconfigurator" element={<ShelfConfigurator />} />
          <Route path="/info"        element={<Info/>} />
          <Route path="/products"        element={<Products />} />
          <Route path="/products/Eetu-Hylly" element={<EetuHylly />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
