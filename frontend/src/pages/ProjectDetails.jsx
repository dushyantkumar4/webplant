import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { ArrowLeft, CalendarDays, FolderKanban } from "lucide-react";

import { getProjects } from "../redux/projectSlice";
import TaskList from "../components/tasks/TaskList";

function ProjectDetails() {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const { projects, isLoading } = useSelector(
    (state) => state.projects
  );

  const project = projects.find((item) => item._id === projectId);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(getProjects());
    }
  }, [dispatch, projects.length]);

  if (isLoading && !project) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
        <FolderKanban className="mx-auto text-gray-400" size={40} />

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Project not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          This project may not exist or may no longer be available.
        </p>

        <Link
          to="/projects"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Back to Projects
      </Link>

      {/* Project information */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FolderKanban size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
            <CalendarDays size={17} />

            <span>
              Created{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Project Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage tasks, update their status, and track due dates.
          </p>
        </div>

        <TaskList projectId={projectId} />
      </div>
    </div>
  );
}

export default ProjectDetails;