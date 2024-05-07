import { Route, Routes, } from 'react-router-dom'

import Main from './sivut/etusivu'
import TestiSivu from './sivut/testiSivu'
import Kirjautuminen from './komponentit/kirjautuminen'
import LisääTeksti from './sivut/lisääTeksti'

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
      <Route path="/Lisää teksti"
        element={<LisääTeksti/>}/>
    </Routes>

  )
}

export default AppRoutes
