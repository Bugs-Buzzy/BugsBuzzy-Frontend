import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoadingScreen from '@/components/LoadingScreen';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import GameWorld from '@/pages/GameWorld';
import Panel from '@/pages/Panel';
import Announcements from '@/pages/panel/Announcements';
import Dashboard from '@/pages/panel/Dashboard';
import GameJamCompetition from '@/pages/panel/GameJamCompetition';
import InPersonCompetition from '@/pages/panel/InPersonCompetition';
import Presentations from '@/pages/panel/Presentations';
import ProfileSettings from '@/pages/panel/ProfileSettings';
import PaymentFailed from '@/pages/PaymentFailed';
import PaymentSuccess from '@/pages/PaymentSuccess';
import '@/styles/components.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Loading screen will auto-complete after 3 seconds
    // You can also trigger it manually if needed
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
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
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
