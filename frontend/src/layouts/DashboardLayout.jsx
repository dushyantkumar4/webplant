
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar / Navbar */}
      <header className="border-b bg-white p-4">
        <h1 className="text-xl font-bold">
          Mini Project Manager
        </h1>
      </header>

      {/* Child Pages */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
