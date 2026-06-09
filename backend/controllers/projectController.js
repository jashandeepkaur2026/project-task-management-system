const Project = require("../models/Project");

// Create Project (Admin + Manager)
exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline, manager } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline,
      manager,
      createdBy: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("manager", "name email")
      .populate("createdBy", "name email");

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Project (Admin Only)
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};