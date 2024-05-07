import { createRoot } from 'react-dom/client'
import './tyylit/global.css';
import RoutedApp from './App'


const container = document.getElementById('root')
const root = createRoot(container)


if (typeof global === "undefined") {
  window.global = window;
}

root.render(<RoutedApp />)
