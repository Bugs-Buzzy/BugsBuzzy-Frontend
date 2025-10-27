import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import bgGameJam from '@/assets/bkg-gamejam.png';
import bgInPerson from '@/assets/bkg-inperson.png';
import bgLanding from '@/assets/bkg-landing.png';
import bgSponsor from '@/assets/bkg-sponsor.png';
import bgStaff from '@/assets/bkg-staff.png';
import bgWorkshops from '@/assets/bkg-workshops.png';
import LoadingScreen from '@/components/LoadingScreen';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import GameWorld from '@/pages/GameWorld';
import MiniGamePage from '@/pages/MiniGamePage';
import Panel from '@/pages/Panel';
import Announcements from '@/pages/panel/Announcements';
import Dashboard from '@/pages/panel/Dashboard';
import GameJamCompetition from '@/pages/panel/GameJamCompetition';
import InPersonCompetition from '@/pages/panel/InPersonCompetition';
import Presentations from '@/pages/panel/Presentations';
import ProfileSettings from '@/pages/panel/ProfileSettings';
import PaymentFailed from '@/pages/PaymentFailed';
import PaymentSuccess from '@/pages/PaymentSuccess';
import { loadingStateManager } from '@/utils/loadingState';
import '@/styles/components.css';

function AppRoutes() {
  const navigate = useNavigate();
  const { setOnLoginSuccess } = useAuth();

  useEffect(() => {
    setOnLoginSuccess(() => () => {
      navigate('/panel/dashboard');
    });

    return () => {
      setOnLoginSuccess(undefined);
    };
  }, [navigate, setOnLoginSuccess]);

  return (
    <Routes>
      <Route path="/" element={<GameWorld />} />

      {/* Payment callback routes */}
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failed" element={<PaymentFailed />} />

      <Route
        path="/panel"
        element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/panel/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="inperson" element={<InPersonCompetition />} />
        <Route path="gamejam" element={<GameJamCompetition />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="presentations" element={<Presentations />} />
        <Route path="minigame" element={<MiniGamePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  // Check if loading screen should be shown based on state manager
  const [isLoading, setIsLoading] = useState(() => loadingStateManager.shouldShowLoading());

  // Images to preload during loading screen
  const imagesToPreload = [bgLanding, bgGameJam, bgInPerson, bgSponsor, bgStaff, bgWorkshops];

  const handleLoadingComplete = () => {
    // Mark loading as completed in localStorage
    loadingStateManager.markLoadingCompleted();
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} imagesToPreload={imagesToPreload} />;
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
