import Project from "../models/Project.js";

// Create Project
export const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }

    const project = await Project.create({
      title,
      description,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Get All User Projects
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Project
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Update Project
export const updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.projectId,
        user: req.user.id,
      },
      {
        title,
        description,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Delete all tasks belonging to this project
    const { default: Task } = await import("../models/Task.js");

    await Task.deleteMany({
      project: project._id,
    });

    return res.status(200).json({
      success: true,
      message: "Project and its tasks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
