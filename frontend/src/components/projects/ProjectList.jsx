import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderPlus, FolderOpen, LoaderCircle, RefreshCw } from "lucide-react";

import { getProjects, deleteProject } from "../../redux/projectSlice.js";

import ProjectCard from "./ProjectCard.jsx";
import ProjectForm from "../forms/ProjectForm.jsx";

const ProjectList = () => {
  const dispatch = useDispatch();

  const { projects, isLoading, error } = useSelector((state) => state.projects);

  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Fetch projects when component mounts
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  // Open create form
  const handleCreate = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProject(null);
  };

  // Delete project
  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? All tasks inside this project will also be deleted.",
    );

    if (!confirmed) return;

    setDeleteError("");

    try {
      await dispatch(deleteProject(projectId)).unwrap();
    } catch (error) {
      setDeleteError(
        typeof error === "string"
          ? error
          : "Unable to delete project. Please try again.",
      );
    }
  };

  // Retry fetching projects
  const handleRetry = () => {
    dispatch(getProjects());
  };

  return (
    <section className="w-full">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            My Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage and organize all your projects in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          <FolderPlus className="h-4 w-4" />
          Create Project
        </button>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {deleteError}
        </div>
      )}

      {/* Loading state */}
      {isLoading && projects.length === 0 && (
        <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white">
          <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Loading your projects...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && projects.length === 0 && (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-center">
          <p className="text-sm font-medium text-red-600">
            {typeof error === "string"
              ? error
              : "Unable to load your projects."}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <FolderOpen className="h-7 w-7" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            No projects yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            You haven't created any projects. Start by creating your first
            project and organizing your tasks.
          </p>

          <button
            type="button"
            onClick={handleCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <FolderPlus className="h-4 w-4" />
            Create Your First Project
          </button>
        </div>
      )}

      {/* Project grid */}
      {projects.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
              found
            </p>

            {isLoading && (
              <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Create / Edit project modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseForm();
            }
          }}
        >
          <div className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <ProjectForm project={selectedProject} onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectList;
