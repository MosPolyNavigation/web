import { useEffect } from 'react'
import { dataStore } from './store/useDataStore.ts'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainPage from './pages/App/MainPage.tsx'
import ReportPage from './pages/ReportPage/ReportPage.tsx'
import Toast from './components/common/Toast/Toast.tsx'

const App = () => {
  useEffect(() => {
    dataStore().init()
  }, [])

  return (
    <BrowserRouter basename="/web">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
