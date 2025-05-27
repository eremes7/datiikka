import { materialBank } from './utils/materialMap'
import React, { useState, useEffect, useRef, useMemo } from 'react'

export function PlacedModelSidebar({ placedModels, setPlacedModels }) {
  return (
    <aside className="w-64 p-4 bg-white shadow-inner overflow-auto">
      <h3 className="font-semibold mb-2">Placed Components</h3>
      <ul className="space-y-2">
        {placedModels.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <span className="flex-1">
              {m.component?.name || m.name}
            </span>
            <div
              className="w-6 h-6 bg-center bg-cover rounded border"
              style={{ backgroundImage: `url(${materialBank[m.materialKey].map})` }}
            />
            <button
              onClick={() =>
                setPlacedModels((prev) =>
                  prev.filter((x) => x.id !== m.id)
                )
              }
              className="ml-2 text-red-500 hover:text-red-700"
            >
            </button>
          </li>
        ))}
        {placedModels.length === 0 && (
          <li className="text-gray-500">No models placed</li>
        )}
      </ul>
    </aside>
  )
}

export default PlacedModelSidebar
