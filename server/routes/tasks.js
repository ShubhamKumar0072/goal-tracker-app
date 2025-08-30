const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const addNewTask = require("../util/newTask");
const { deleteTaskByGoal, deleteTaskById } = require("../util/deleteTask");
const ensureAuth = require("../middleware");

//Show a Task
router.get("/",ensureAuth, async (req, res) => {
  try {
    //console.log(req.query.date);
    const date = new Date(req.query.date);    
    const userId = req.user._id; // or req.user.id depending on your setup
    const taskDoc = await Task.findOne({ taskDate: date, userId });

    //console.log("Task Data : ",taskDoc);
    res.send(taskDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//Add a new task
router.post("/",ensureAuth, async (req, res) => {
  try {
    //console.log("arrived Date = ",req.query.date);
    const date = new Date(req.query.date);
    const userId = req.user._id;
    // const taskName = req.body.taskName;
    // console.log(task);
    addNewTask(date, req.body.taskName, req.body.diff,userId, null);
    res.status(200).json({ message: "Task Added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

//Delete a Task
router.delete("/:id",ensureAuth, async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { date } = req.query;
    const userId = req.user._id;

    if (!date || !taskId) {
      return res.status(400).json({ error: "Missing date or taskId in request." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    await deleteTaskById(parsedDate, taskId,userId);
    return res.status(200).json({ message: `Task ${taskId} deleted successfully.` });
  } catch (error) {
    console.error("API error deleting task:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//Edit Task
router.put("/", ensureAuth, async (req, res) => {
  try {
    const { date } = req.query;
    const { tasks } = req.body;
    const userId = req.user._id;

    if (!date || !Array.isArray(tasks)) {
      return res.status(400).json({ error: "Missing date or tasks array." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Validate each task object
    for (const task of tasks) {
      if (
        typeof task.taskName !== "string" ||
        typeof task.isComplete !== "boolean" ||
        typeof task.diff !== "number" ||
        task.diff < 1 || task.diff > 10
      ) {
        return res.status(400).json({ error: "Invalid task format or values." });
      }
    }

    // Find the task document for this user and date
    let taskDoc = await Task.findOne({ taskDate: parsedDate, userId });

    if (!taskDoc) {
      // Create new document scoped to user
      taskDoc = new Task({
        taskDate: parsedDate,
        userId,
        tasks
      });
    } else {
      // Replace tasks array
      taskDoc.tasks = tasks;
    }

    await taskDoc.save();
    res.status(200).json({ message: "Tasks updated successfully", tasks: taskDoc.tasks });

  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;