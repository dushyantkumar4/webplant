import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListTodo,
  Plus,
  LoaderCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import { getTasks, deleteTask, clearTasks } from "../../redux/taskSlice";

import TaskCard from "./TaskCard.jsx";
import TaskFilters from "./TaskFilters.jsx";
import TaskForm from "../forms/TaskForm.jsx";

const TaskList = ({ projectId }) => {
  const dispatch = useDispatch();

  const { tasks, isLoading, error } = useSelector((state) => state.tasks);

  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("asc");

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // Fetch tasks whenever project or filters change
  useEffect(() => {
    if (!projectId) return;

    dispatch(
      getTasks({
        projectId,
        status,
        sort,
      }),
    );

    return () => {
      dispatch(clearTasks());
    };
  }, [dispatch, projectId, status, sort]);

  // Open create form
  const handleCreate = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  // Delete task
  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    setDeleteError("");

    try {
      await dispatch(
        deleteTask({
          projectId,
          taskId,
        }),
      ).unwrap();
    } catch (error) {
      setDeleteError(
        typeof error === "string"
          ? error
          : "Unable to delete task. Please try again.",
      );
    }
  };

  // Retry fetching tasks
  const handleRetry = () => {
    dispatch(
      getTasks({
        projectId,
        status,
        sort,
      }),
    );
  };

  return (
    <section className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 sm:text-2xl">
            <ListTodo className="h-6 w-6 text-indigo-600" />
            Project Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your tasks, track progress, and meet deadlines.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters
        status={status}
        sort={sort}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {/* Delete error */}
      {deleteError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {deleteError}
        </div>
      )}

      {/* Loading state */}
      {isLoading && tasks.length === 0 && (
        <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white">
          <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Loading tasks...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && tasks.length === 0 && (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-center">
          <p className="text-sm font-medium text-red-600">
            {typeof error === "string" ? error : "Unable to load tasks."}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && tasks.length === 0 && (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ClipboardList className="h-7 w-7" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900">
            {status === "all" ? "No tasks yet" : "No matching tasks"}
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {status === "all"
              ? "Start adding tasks to this project to keep your work organized."
              : "There are no tasks with this status. Try another filter."}
          </p>

          {status === "all" && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Your First Task
            </button>
          )}
        </div>
      )}

      {/* Task list */}
      {tasks.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
            </p>

            {isLoading && (
              <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Create / Edit task modal */}
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
            <TaskForm
              projectId={projectId}
              task={selectedTask}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskList;
