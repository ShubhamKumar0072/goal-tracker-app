const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const addNewTask = require("../util/newTask");
const { deleteTaskByGoal, deleteTaskById } = require("../util/deleteTask");

//Show a Task
router.get("/", async (req, res) => {
  try {
    //console.log(req.query.date);
    const date = new Date(req.query.date);
    const taskDoc = await Task.findOne({ taskDate: date });
    //console.log("Task Data : ",taskDoc);
    res.send(taskDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//Add a new task
router.post("/", async (req, res) => {
  try {
    //console.log("arrived Date = ",req.query.date);
    const date = new Date(req.query.date);
    // const taskName = req.body.taskName;
    // console.log(task);
    addNewTask(date, req.body.taskName, req.body.diff);
    res.status(200).json({ message: "Task Added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

//Delete a Task
router.delete("/:id", async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { date } = req.query;

    if (!date || !taskId) {
      return res.status(400).json({ error: "Missing date or taskId in request." });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    await deleteTaskById(parsedDate, taskId);
    return res.status(200).json({ message: `Task ${taskId} deleted successfully.` });
  } catch (error) {
    console.error("API error deleting task:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//Edit Task
router.put("/", async (req, res) => {
  try {
    const { date } = req.query;
    const { tasks } = req.body;

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

    // Find or create the task document
    let taskDoc = await Task.findOne({ taskDate: parsedDate });

    if (!taskDoc) {
      taskDoc = new Task({
        taskDate: parsedDate,
        tasks: tasks
      });
    } else {
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