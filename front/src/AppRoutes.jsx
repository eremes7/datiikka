import { Route, Routes, } from 'react-router-dom'

import Main from './sivut/etusivu'
import TestiSivu from './sivut/testiSivu'
import Kirjautuminen from './komponentit/kirjautuminen'

const AppRoutes = ({ user, setUser, errorMessage, setErrorMessage }) => {
  return (
    
    <Routes>
      <Route path="/"
        element={<Main />}/>
      <Route path="/testiSivut"
        element={<TestiSivu/>}/>
      <Route path="/Kirjautuminen" 
        element={<Kirjautuminen
            user={user} 
            setUser={setUser}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage} />} />
    </Routes>

  )
}

export default AppRoutes
