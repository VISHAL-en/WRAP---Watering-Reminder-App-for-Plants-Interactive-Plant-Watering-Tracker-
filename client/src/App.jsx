import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import Profile from './pages/Profile';
import StreakPage from './pages/StreakPage';
import PlantPage from './pages/PlantPage';
import AchievementsPage from './pages/AchievementsPage';
import RealPlantsPage from './pages/RealPlantsPage';
import RealPlantTimelinePage from './pages/RealPlantTimelinePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/streak" element={<StreakPage />} />
          <Route path="/plant" element={<PlantPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/real-plants" element={<RealPlantsPage />} />
          <Route path="/real-plants/:id" element={<RealPlantTimelinePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
