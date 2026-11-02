import {
  CalendarDays,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Clock3,
} from "lucide-react";

const statusConfig = {
  todo: {
    label: "To Do",
    className: "bg-slate-100 text-slate-700",
    icon: Circle,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700",
    icon: Clock3,
  },
  done: {
    label: "Done",
    className: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
};

const formatDate = (date) => {
  if (!date) return "No due date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Invalid date";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const status = statusConfig[task.status] || statusConfig.todo;
  const StatusIcon = status.icon;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0) &&
    task.status !== "done";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        {/* Task details */}
        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-base font-semibold ${
              task.status === "done"
                ? "text-slate-400 line-through"
                : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>

          <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-slate-500">
            {task.description || "No description added."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            title="Edit task"
            aria-label={`Edit ${task.title}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(task._id)}
            title="Delete task"
            aria-label={`Delete ${task.title}`}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        {/* Status */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.className}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>

        {/* Due date */}
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${
            isOverdue ? "text-red-600" : "text-slate-500"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          <span>
            {isOverdue ? "Overdue: " : "Due: "}
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
