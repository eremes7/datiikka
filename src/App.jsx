// Muu jonniinjoutava
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'

// Komponentit
import NavBar from './komponentit/navbar'
import Header from './komponentit/header'

const App = () => {
  return (
    <>
    <Header />
    <NavBar/>
    <AppRoutes
     />

    </>
    )
}

export default function RoutedApp() {
  return <Router><App /></Router>
    }
