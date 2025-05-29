// src/components/Navibar.jsx
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { GlobeAltIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext' 

export default function Navibar({ items }) {
  const { items: cartItems, toggleCart } = useCart()
  const [show, setShow]        = useState(true)
  const [lastScrollY, setLast] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setShow(!(y > lastScrollY && y > 50))
      setLast(y)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])

  return (
    <nav
      className={`
        bg-white fixed inset-x-0 top-0 h-16 z-[9999]
        shadow transition-transform duration-300
        ${show ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="max-w-8xl mx-auto h-full px-4 flex items-center justify-between">
        {/* Navigaatiolinkit */}
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

          {/* Kauppakassi */}
          <button
            type="button"
            onClick={() => toggleCart() }
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
