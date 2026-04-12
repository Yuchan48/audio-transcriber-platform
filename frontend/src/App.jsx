import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import context and routes
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Import pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminAudio from "./pages/dashboard/AdminAudio";
import UserDashboard from "./pages/dashboard/UserDashboard";

const App = () => {
  return (
    <div className="App bg-gray-300 min-h-screen w-full flex items-center justify-center">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* User Dashboard */}
            <Route index element={<UserDashboard />} />
            {/* Admin Routes */}
            <Route
              path="users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="all-audio"
              element={
                <AdminRoute>
                  <AdminAudio />
                </AdminRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
