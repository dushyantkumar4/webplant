import { Filter, ArrowDownWideNarrow } from "lucide-react";

const TaskFilters = ({
  status,
  sort,
  onStatusChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Status filter */}
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="task-status-filter"
          className="flex items-center gap-2 text-sm font-medium text-slate-600"
        >
          <Filter className="h-4 w-4" />
          Filter:
        </label>

        <select
          id="task-status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-44"
        >
          <option value="all">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Due date sorting */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor="task-sort"
          className="flex items-center gap-2 text-sm font-medium text-slate-600"
        >
          <ArrowDownWideNarrow className="h-4 w-4" />
          Sort by:
        </label>

        <select
          id="task-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-48"
        >
          <option value="asc">Due date: Earliest first</option>
          <option value="desc">Due date: Latest first</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;