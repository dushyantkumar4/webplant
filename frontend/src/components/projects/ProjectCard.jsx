import { Link } from "react-router";
import {
  CalendarDays,
  Folder,
  Pencil,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const createdDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <div className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Folder className="h-5 w-5" />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(project)}
            aria-label={`Edit ${project.title}`}
            title="Edit project"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(project._id)}
            aria-label={`Delete ${project.title}`}
            title="Delete project"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Project details */}
      <div className="mt-5 flex-1">
        <h3 className="break-words text-lg font-semibold text-slate-900">
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[4.5rem] break-words text-sm leading-6 text-slate-500">
          {project.description || "No description added for this project."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>Created {createdDate}</span>
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          View project
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
