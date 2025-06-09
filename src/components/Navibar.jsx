// src/components/Navibar.jsx
import { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { GlobeAltIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'

export default function Navibar({ items }) {
  const { items: cartItems, toggleCart } = useCart()
  const [show, setShow] = useState(true)
  const [bgOpacity, setBgOpacity] = useState(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY

      // piilota navbar rullatessa alas ja näytä rullatessa ylöspäin
      if (y > lastScrollY.current && y > 50) setShow(false)
      else setShow(true)
      lastScrollY.current = y

      // asteittainen opacity: 0 → 1 ensimmäisten 100px aikana
      setBgOpacity(Math.min(y / 100, 1))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{ backgroundColor: `rgba(255,255,255,${bgOpacity})` }}
      className={`
        fixed inset-x-0 top-0 h-16 z-[9999]
        shadow transition-transform transition-colors duration-300
        ${show ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="max-w-8xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {items.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => isActive ? 'font-bold' : ''}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <GlobeAltIcon className="w-7 h-7 text-gray-600" />
          <select
            disabled
            className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white cursor-not-allowed"
          >
            <option>Suomi</option>
            <option>English</option>
          </select>

          <button
            type="button"
            onClick={toggleCart}
            className="relative flex items-center justify-center w-10 h-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ShoppingBagIcon className="w-6 h-6 text-gray-600" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
