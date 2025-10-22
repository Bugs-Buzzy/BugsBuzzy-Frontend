import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingScreen from '@/components/LoadingScreen';
import { AuthProvider } from '@/context/AuthContext';
import GameWorld from '@/pages/GameWorld';
import Panel from '@/pages/Panel';
import MyTeam from '@/pages/panel/MyTeam';
import MyWorkshops from '@/pages/panel/MyWorkshops';
import ProfileSettings from '@/pages/panel/ProfileSettings';
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

          <Route
            path="/panel"
            element={
              <ProtectedRoute>
                <Panel />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/panel/profile" replace />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="workshops" element={<MyWorkshops />} />
            <Route path="team" element={<MyTeam />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
