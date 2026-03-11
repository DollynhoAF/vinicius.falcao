import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './context/LangContext'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Footer from './components/Footer'
import HouiDrivePage from './pages/HouiDrivePage'

const Home = () => (
    <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-container px-6 md:px-20">
            <Hero />
            <ProjectGrid />
            <About />
            <Footer />
        </main>
    </div>
)

const App = () => {
    return (
        <BrowserRouter>
            <LangProvider>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/case/housi-drive" element={<HouiDrivePage />} />
                </Routes>
            </LangProvider>
        </BrowserRouter>
    )
}

export default App
