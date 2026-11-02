import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask, clearTaskError } from "../../redux/taskSlice.js";

// Convert an existing date into YYYY-MM-DD for the date input
const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const TaskForm = ({ projectId, task = null, onClose }) => {
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.tasks);

  const isEditMode = Boolean(task?._id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
  });

  // Populate form when editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        dueDate: formatDate(task.dueDate),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        dueDate: "",
      });
    }

    dispatch(clearTaskError());
  }, [task, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      dueDate: formData.dueDate,
    };

    if (!taskData.title || !taskData.dueDate || !projectId) {
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateTask({
            projectId,
            taskId: task._id,
            taskData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          createTask({
            projectId,
            taskData,
          }),
        ).unwrap();
      }

      onClose?.();
    } catch (error) {
      console.error("Task submission failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          {isEditMode ? "Update Task" : "Create New Task"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isEditMode
            ? "Update your task details below."
            : "Add a task to this project and keep track of your work."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task title */}
        <div>
          <label
            htmlFor="task-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Task Title <span className="text-red-500">*</span>
          </label>

          <input
            id="task-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Design login page"
            maxLength={100}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="task-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what needs to be done..."
            rows={4}
            maxLength={1000}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {formData.description.length}/1000
          </p>
        </div>

        {/* Status and due date */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Status */}
          <div>
            <label
              htmlFor="task-status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="task-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Due date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Due Date <span className="text-red-500">*</span>
            </label>

            <input
              id="task-due-date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
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
            disabled={
              isLoading ||
              !formData.title.trim() ||
              !formData.dueDate ||
              !projectId
            }
            className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
