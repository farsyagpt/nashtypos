import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import POSPage from './pages/pos/POSPage'
import KDSPage from './pages/kds/KDSPage'
import BackofficePage from './pages/backoffice/BackofficePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pos/*" element={<POSPage />} />
      <Route path="/kds/*" element={<KDSPage />} />
      <Route path="/backoffice/*" element={<BackofficePage />} />
    </Routes>
  )
}

export default App
