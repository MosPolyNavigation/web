import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './pages/App/App.tsx'
import ReportPage from './pages/ReportPage/ReportPage.tsx'
import Toast from './components/common/Toast/Toast.tsx'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/web">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/report" element={<ReportPage />} />
    </Routes>
    <Toast />
  </BrowserRouter>
)
