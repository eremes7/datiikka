import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { GlobeAltIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'


export default function Navibar({ items }) {
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
	<div className="flex space-x-2 items-center ml-auto">
	    <GlobeAltIcon className="center w-7 h-7"/>
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
	    className="
	      flex items-center justify-center 
		w-10 space-x-6
	      p-2 rounded-full 
	      bg-gray-100 hover:bg-gray-200 
	      transition-colors
	    "
	  >
	    <ShoppingBagIcon className="space-x-6 w-6 h-6 text-gray-600" />
	  </button>

	</div>

      </div>
    </nav>
  )
}
