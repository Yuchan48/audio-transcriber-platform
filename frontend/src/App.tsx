import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// Import context and routes
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#333", // dark background
            color: "#fff", // text color
            fontWeight: "500",
            borderRadius: "10px",
            padding: "12px 20px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            maxWidth: "420px",
            width: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
          success: {
            duration: 6000, // longer duration for success
            theme: {
              primary: "green",
              secondary: "white",
            },
          },
          error: {
            duration: 8000, // longer duration for errors
            theme: {
              primary: "red",
              secondary: "white",
            },
          },
        }}
      />
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
