import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

// import UI components
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const Dashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full  bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-50
          h-full w-64 bg-gray-900 text-white p-4
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Link
          to="/impressum"
          state={{ from: location.pathname }}
          className="w-full text-center text-sm pb-4 text-gray-600 hover:underline"
        >
          Impressum
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
