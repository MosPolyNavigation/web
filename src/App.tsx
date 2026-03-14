import { useEffect } from 'react'
import { dataStore } from './store/useDataStore.ts'
import { BrowserRouter, Route, Routes } from 'react-router'
import MainPage from './pages/App/MainPage.tsx'
import ReportPage from './pages/ReportPage/ReportPage.tsx'
import { DodLayout } from './pages/DodLayout/DodLayout.tsx'

const App = () => {
  useEffect(() => {
    dataStore().init()
  }, [])

  return (
    <BrowserRouter basename={window.location.origin.includes('mpunav.ru') ? undefined : '/web'}>
      <Routes>
        <Route element={<DodLayout />}>
          <Route path='/' element={<MainPage />} />
          <Route path='/report' element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
