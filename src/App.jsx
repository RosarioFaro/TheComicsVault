import { Route, BrowserRouter, Routes } from "react-router";
import "./App.css";
import VolumesPage from "./components/VolumesPage";
import VolumeDetailPage from "./components/VolumeDetailPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PublisherPage from "./components/PublisherPage";
import UserLibraryPage from "./components/UserLibraryPage";
import AuthPage from "./components/AuthPage";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ProfileEditPage from "./components/ProfileEditPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/volumes" element={<VolumesPage />} />
            <Route path="/volumes/:id" element={<VolumeDetailPage />} />
            <Route path="/publisher/:id" element={<PublisherPage />} />
            <Route path="/library" element={<UserLibraryPage />} />
            <Route path="/profile" element={<ProfileEditPage />} />
          </Routes>
        </div>
        <Footer />
        <ScrollToTopButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
