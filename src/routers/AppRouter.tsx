import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
    </div>
  );
}

/** Only for signed-in users; otherwise bounce to /login. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return user ? children : <Navigate to="/login" replace />;
}

/** Only for signed-out users; if already signed in, send to the dashboard. */
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
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
