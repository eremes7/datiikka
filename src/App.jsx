import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navibar from './components/Navibar'
import FrontPage from './pages/FrontPage'
import ShelfConfigurator from './pages/Three'
import TestScene from './pages/TestScene'
import Products from './pages/Products'
import Info from './pages/Info'

const navItems = [
  { to: '/',                  label: 'Etusivu' },
  { to: '/shelfconfigurator', label: 'Rakenna hylly' },
  { to: '/testScene',         label: 'TestScene' },
  { to: '/products',          label: 'Tuotteet' },
  { to: '/info',          label: 'Tietoa' },
]

function App() {
  return (
    <BrowserRouter>
      <Navibar items={navItems} />
      <main className="pt-16 p-4">
        <Routes>
          <Route path="/"                element={<FrontPage />} />
          <Route path="/shelfconfigurator" element={<ShelfConfigurator />} />
          <Route path="/testScene"       element={<TestScene />} />
          <Route path="/products"        element={<Products />} />
          <Route path="/info"        element={<Info/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
