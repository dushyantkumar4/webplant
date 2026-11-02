import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import {
  FolderKanban,
  ListTodo,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Eye
} from "lucide-react";

import { getProjects } from "../redux/projectSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "done").length,
      pending: tasks.filter((task) => task.status !== "done").length,
    };
  }, [tasks]);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
    },
    {
      label: "Total Tasks",
      value: taskStats.total,
      icon: ListTodo,
    },
    {
      label: "Pending Tasks",
      value: taskStats.pending,
      icon: Clock,
    },
    {
      label: "Completed Tasks",
      value: taskStats.completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">Overview</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome back, {user?.name || "User"}!
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here's an overview of your projects and tasks.
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Eye size={18} />
          View Projects
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-gray-900">
                {isLoading ? "—" : stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Recent projects */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly access your latest projects.
            </p>
          </div>

          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading projects...
          </p>
        ) : projects.length === 0 ? (
          <div className="py-10 text-center">
            <FolderKanban className="mx-auto text-gray-400" size={36} />

            <h3 className="mt-3 font-medium text-gray-900">No projects yet</h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first project to get started.
            </p>

            <Link
              to="/projects"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.slice(0, 4).map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="rounded-lg border border-gray-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-900">
                      {project.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  <ArrowRight size={18} className="shrink-0 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
