// src/pages/shoppingBasket/BasketSidebar.jsx
import { Fragment } from 'react'
import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

export default function BasketSidebar() {
  const { isOpen, toggleCart, items, removeItem } = useCart()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <Fragment>
      {/* Overlay, klikkaus sulkee */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[10001]"
          onClick={toggleCart}
        />
      )}

      {/* Slide-over-paneeli */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full max-w-md bg-white z-[10001]
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Ostoskori</h2>
          <button onClick={toggleCart} className="text-gray-600">✕</button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-500">Kori on tyhjä.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex justify-between py-2">
                <span>{item.name} x{item.quantity}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500"
                >
                  Poista
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <p className="font-semibold mb-4">Yhteensä: €{total.toFixed(2)}</p>
          <Link
            to="/checkout"
            onClick={toggleCart}
            className="block text-center py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Siirry kassalle
          </Link>
        </div>
      </div>
    </Fragment>
  )
}
