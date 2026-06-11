import { BrowserRouter, Routes, Route } from 'react-router-dom'
import POSPage from './pages/pos/POSPage'
import HomePage from './pages/HomePage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pos/*" element={<POSPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
