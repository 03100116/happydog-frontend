import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Studio from './pages/Studio'
import MySongs from './pages/MySongs'
import Community from './pages/Community'
import Podcast from './pages/Podcast'
import Pricing from './pages/Pricing'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Studio />} />
        <Route path="/my" element={<MySongs />} />
        <Route path="/community" element={<Community />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
