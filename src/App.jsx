
import { BrowserRouter as Router } from 'react-router-dom'

import AppRoutes from './AppRoutes'


const App = () => {
  return (
    <>
    <h1> Datiikka  </h1>
    <AppRoutes
     />

    </>
    )
}

export default function RoutedApp() {
  return <Router><App /></Router>
    }
