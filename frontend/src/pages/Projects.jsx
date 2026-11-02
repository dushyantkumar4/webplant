import { FolderKanban } from "lucide-react";
import ProjectList from "../components/projects/ProjectList";

function Projects() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <div className="flex items-center gap-2">
          <FolderKanban className="text-indigo-600" size={24} />

          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Create, manage, and organize all your projects in one place.
        </p>
      </div>

      {/* Project CRUD */}
      <ProjectList />
    </div>
  );
}

export default Projects;
