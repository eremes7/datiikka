// Muu jonniinjoutava
import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'

// Komponentit
import NavBar from './komponentit/navbar'
import Header from './komponentit/header'

// Palvelut
import haltijaPalvelu from './palvelut/haltijaPalvelu'
import Kirjautuminen from './palvelut/kirjautuminen'

const App = () => {
  const [tekstit, setTekstit] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    haltijaPalvelu
      .getAll()
      .then(initialTekstit => {
        setTekstit(initialTekstit)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedWebKaluAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      haltijaPalvelu.setToken(user.token)
    }
  }, [])

  return (
    <>
    <Header />
    <NavBar/>
    
    <AppRoutes
      user={user}
      setUser={setUser}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
     />

    </>
    )
}

export default function RoutedApp() {
  return <Router><App /></Router>
    }
