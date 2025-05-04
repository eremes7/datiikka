import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navibar from './components/Navibar'
import FrontPage from './pages/FrontPage'
import ShelfConfigurator from './pages/Three'
import TestScene from './pages/TestScene'

function App() {
    return (
        <BrowserRouter>
            <Navibar />
            <main className="pt-16 p-4">
                <Routes>
                    <Route path="/" element={<FrontPage />} />
                    <Route path="/shelfconfigurator" element={<ShelfConfigurator />} />
                    <Route path="/testScene" element={<TestScene />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App;
