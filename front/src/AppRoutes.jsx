import { Route, Routes, } from 'react-router-dom'

import Main from './sivut/etusivu'
import TestiSivu from './sivut/testiSivu'


const AppRoutes = () => {
  return (
    
    <Routes>
      <Route path="/"
        element={<Main />}/>
      <Route path="/testiSivut"
        element={<TestiSivu/>}/>
    </Routes>

  )
}

export default AppRoutes
