import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  updateProject,
  clearProjectError,
} from "../../redux/projectSlice.js";

const ProjectForm = ({ project = null, onClose }) => {
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.projects);

  const isEditMode = Boolean(project?._id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Populate fields when editing an existing project
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }

    dispatch(clearProjectError());
  }, [project, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (!projectData.title) {
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateProject({
            projectId: project._id,
            projectData,
          }),
        ).unwrap();
      } else {
        await dispatch(createProject(projectData)).unwrap();
      }

      onClose?.();
    } catch (error) {
      console.error("Project submission failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {isEditMode ? "Update Project" : "Create New Project"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isEditMode
            ? "Update your project details below."
            : "Add a new project to organize your work."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project title */}
        <div>
          <label
            htmlFor="project-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Project Title <span className="text-red-500">*</span>
          </label>

          <input
            id="project-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Website Redesign"
            maxLength={100}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-xs text-slate-400">
            Give your project a clear and meaningful name.
          </p>
        </div>

        {/* Project description */}
        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="project-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what this project is about..."
            rows={4}
            maxLength={1000}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {formData.description.length}/1000
          </p>
        </div>

        {/* API error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {typeof error === "string"
              ? error
              : "Something went wrong. Please try again."}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !formData.title.trim()}
            className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
