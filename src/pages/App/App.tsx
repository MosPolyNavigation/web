import MainLayout from "../../components/layouts/MainLayout/MainLayout.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReportPage from "../ReportPage/ReportPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="/report" element={<ReportPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
