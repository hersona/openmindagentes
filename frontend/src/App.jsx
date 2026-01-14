import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CourageLab from './pages/CourageLab'
import CultureHunter from './pages/CultureHunter'
import GrowthMapper from './pages/GrowthMapper'
import InterviewGym from './pages/InterviewGym'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courage-lab" element={<CourageLab />} />
        <Route path="/culture-hunter" element={<CultureHunter />} />
        <Route path="/growth-mapper" element={<GrowthMapper />} />
        <Route path="/interview-gym" element={<InterviewGym />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
