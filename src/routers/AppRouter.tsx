import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { ProfileProvider } from "../contexts/ProfileContext";
import { XPProvider } from "../contexts/XPContext";
import { HabitsProvider } from "../contexts/HabitsContext";
import { SleepProvider } from "../contexts/SleepContext";
import { AchievementsProvider } from "../contexts/AchievementsContext";

import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login/Login";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import HabitsPage from "../pages/Habits/HabitsPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import CalendarPage from "../pages/Calendar/CalendarPage";
import SleepPage from "../pages/Sleep/SleepPage";
import AchievementsPage from "../pages/Achievements/AchievementsPage";
import SettingsPage from "../pages/Settings/SettingsPage";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-lime border-t-transparent" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return user ? <Navigate to="/" replace /> : children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <ProfileProvider>
                <XPProvider>
                  <AchievementsProvider>
                    <HabitsProvider>
                      <SleepProvider>
                        <MainLayout />
                      </SleepProvider>
                    </HabitsProvider>
                  </AchievementsProvider>
                </XPProvider>
              </ProfileProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
