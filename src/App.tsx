import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLogin } from './pages/AdminLogin';
import { StudentDashboard } from './pages/StudentDashboard';
import { ReportComplaint } from './pages/ReportComplaint';
import { ComplaintDetails } from './pages/ComplaintDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);

  const handleNavigate = (view: string, id?: string) => {
    if (id) {
      setSelectedComplaintId(id);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <Landing
            onNavigate={handleNavigate}
            onOpenSQLModal={() => setSupabaseModalOpen(true)}
          />
        );

      case 'login':
        return <Login onNavigate={handleNavigate} />;

      case 'register':
        return <Register onNavigate={handleNavigate} />;

      case 'admin-login':
        return <AdminLogin onNavigate={handleNavigate} />;

      case 'student-dashboard':
        return <StudentDashboard onNavigate={handleNavigate} />;

      case 'report':
        return <ReportComplaint onNavigate={handleNavigate} />;

      case 'complaint-details':
        return (
          <ComplaintDetails
            complaintId={selectedComplaintId || 'cmp-seed-1'}
            onNavigate={handleNavigate}
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
            onOpenSQLModal={() => setSupabaseModalOpen(true)}
          />
        );

      case 'settings':
        return <Settings onOpenSQLModal={() => setSupabaseModalOpen(true)} />;

      default:
        return (
          <Landing
            onNavigate={handleNavigate}
            onOpenSQLModal={() => setSupabaseModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      <div className="flex-1">{renderCurrentView()}</div>

      {/* Supabase Schema & Setup Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
