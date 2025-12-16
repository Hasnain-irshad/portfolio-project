import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public pages
import PublicPortfolio from './pages/PublicPortfolio';

// Admin pages
import Login from './pages/admin/Login';
import AdminLayout from './components/admin/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProfileManagement from './pages/admin/ProfileManagement';
import ResumeManagement from './pages/admin/ResumeManagement';
import ProjectsManagement from './pages/admin/ProjectsManagement';
import SkillsManagement from './pages/admin/SkillsManagement';
import ExperienceManagement from './pages/admin/ExperienceManagement';
import EducationManagement from './pages/admin/EducationManagement';
import AchievementsManagement from './pages/admin/AchievementsManagement';
import CertificatesManagement from './pages/admin/CertificatesManagement';

import './styles/index.css';
import './styles/admin-tables.css';
import './styles/admin-forms.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicPortfolio />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<ProfileManagement />} />
        <Route path="resume" element={<ResumeManagement />} />
        <Route path="projects" element={<ProjectsManagement />} />
        <Route path="skills" element={<SkillsManagement />} />
        <Route path="experience" element={<ExperienceManagement />} />
        <Route path="education" element={<EducationManagement />} />
        <Route path="achievements" element={<AchievementsManagement />} />
        <Route path="certificates" element={<CertificatesManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
