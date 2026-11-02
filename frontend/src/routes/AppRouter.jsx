
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
// import Dashboard from "../pages/Dashboard";
// import Projects from "../pages/Projects";
// import ProjectDetails from "../pages/ProjectDetails";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },

  // Protected routes
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: DashboardLayout,
        children: [
          // {
          //   index: true,
          //   Component: Dashboard,
          // },
          // {
          //   path: "projects",
          //   Component: Projects,
          // },
          // {
          //   path: "projects/:projectId",
          //   Component: ProjectDetails,
          // },
        ],
      },
    ],
  },

  // 404 Route
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
