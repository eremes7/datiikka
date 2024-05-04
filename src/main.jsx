import { createRoot } from 'react-dom/client'

import RoutedApp from './App'


const container = document.getElementById('root')
const root = createRoot(container)


if (typeof global === "undefined") {
  window.global = window;
}

root.render(<RoutedApp />)
