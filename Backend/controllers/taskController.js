import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Create Task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const { projectId } = req.params;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Task title and due date are required",
      });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project: project._id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Get Tasks with Filter and Sorting
export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, sort = "asc" } = req.query;

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Build filter dynamically
    const filter = {
      project: project._id,
    };

    if (status) {
      filter.status = status;
    }

    // Sort by dueDate
    const sortOrder = sort === "desc" ? -1 : 1;

    const tasks = await Task.find(filter).sort({
      dueDate: sortOrder,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Update Task
export const updateTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, dueDate } = req.body;

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Find task inside this project
    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        project: project._id,
      },
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Task
export const deleteTask = async (req, res, next) => {
  try {
    const { projectId, taskId } = req.params;

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      project: project._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
