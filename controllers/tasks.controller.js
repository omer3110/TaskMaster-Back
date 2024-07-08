const Task = require("../models/task.model");
const User = require("../models/user.model");

async function getTasks(req, res) {
  const title = req.query.title || "";
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;
  // const skip = (page - 1) * limit || 0;

  const query = {
    title: { $regex: title, $options: "i" },
    user: req.userId, // Ensure only tasks belonging to the user are fetched
  };

  try {
    const tasks = await Task.find(query);
    // const total = await Task.countDocuments(query);
    // const totalPages = Math.ceil(total / limit);

    res.json({
      tasks,
      // currentPage: page,
      // totalPages: totalPages,
      // totalTasks: total,
    });
  } catch (err) {
    console.log("tasks.controller, getTasks. Error while getting tasks", err);
    res.status(500).json({ message: err.message });
  }
}

async function getTaskById(req, res) {
  const { id } = req.params;

  try {
    const task = await Task.findOne({ _id: id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    if (err.name === "CastError") {
      console.log(
        `tasks.controller, getTaskById. Task not found with id: ${id}`
      );
      return res.status(404).json({ message: "Task not found" });
    }
    console.log(
      `tasks.controller, getTaskById. Error while getting Task with id: ${id}`,
      err.name
    );
    res.status(500).json({ message: err.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!deletedTask) {
      console.log(
        `tasks.controller, deleteTask. Task not found with id: ${id}`
      );
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the user's task array
    await User.findByIdAndUpdate(req.userId, {
      $pull: { tasks: id },
    });

    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.log(err);
    console.log(
      `tasks.controller, deleteTask. Error while deleting Task with id: ${id}`,
      err.name
    );
    res.status(500).json({ message: err.message });
  }
}

async function createTask(req, res) {
  try {
    const newTask = new Task(req.body);
    newTask.user = req.userId;
    const savedTask = await newTask.save();

    // Update the user's task array
    await User.findByIdAndUpdate(req.userId, {
      $push: { tasks: savedTask._id },
    });

    res.status(201).json({ message: "Task added", task: savedTask });
  } catch (err) {
    console.log("tasks.controller, createTask. Error while creating task", err);
    if (err.name === "ValidationError") {
      // Mongoose validation error
      console.log(`tasks.controller, createTask. ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      // Other types of errors
      console.log(`tasks.controller, createTask. ${err.message}`);
      res.status(500).json({ message: "Server error while creating task" });
    }
  }
}

async function editTask(req, res) {
  const { id } = req.params;
  const { title, description, body, todoList, isPinned } = req.body;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, description, body, todoList, isPinned },
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      console.log(`tasks.controller, editTask. Task not found with id: ${id}`);
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.log(err);
    console.log(
      `tasks.controller, editTask. Error while updating task with id: ${id}`,
      err
    );
    if (err.name === "ValidationError") {
      console.log(`tasks.controller, editTask. ${err.message}`);
      res.status(400).json({ message: err.message });
    } else {
      console.log(`tasks.controller, editTask. ${err.message}`);
      res.status(500).json({ message: "Server error while updating task" });
    }
  }
}

module.exports = {
  getTasks,
  getTaskById,
  deleteTask,
  createTask,
  editTask,
};
