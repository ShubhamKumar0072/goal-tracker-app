const express = require("express");
const router = express.Router();
const Goal = require("../models/goal");
const Task = require("../models/task");
const addNewTask = require("../util/newTask");
const { deleteTaskByGoal, deleteTaskById } = require("../util/deleteTask");
const toUTCStartOfDay = require("../util/dateFunc");
const ensureAuth = require("../middleware");

//Get Goal List
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userId = req.user._id; // or req.user.id depending on your setup
    const goals = await Goal.find({ userId });
    res.send(goals);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch goals" });
  }
});



//Add a new Goal
router.post("/", ensureAuth, async (req, res) => {
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  try {
    // Create and save the new goal first
    const userId = req.user._id; // assuming Passport.js or JWT middleware sets this

    // Create and save the new goal with userId
    const newGoal = new Goal({
      ...req.body,
      userId
    });
    await newGoal.save();

    //Saving Tasks for new Goal
    const startDate = new Date(req.body.startDate);
    for (let i = 0; i < req.body.totalDays; i++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + i);
      const dayName = daysOfWeek[currDate.getDay()];

      if (req.body.days.includes(dayName)) {
        //console.log(`Scheduling task on: ${dayName}`);
        await addNewTask(currDate, req.body.goalName, req.body.diff, userId, newGoal._id);
      }
    }

    res.status(201).json({ message: "Goal and tasks added successfully" });

  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(500).json({ error: "Failed to save goal and tasks" });
  }
});


//View One Goal
router.get("/:id", ensureAuth, async (req, res) => {
  let { id } = req.params;
  let goal = await Goal.findById(id);
  res.send(goal);
});


//Edit a Goal
router.put("/:id", ensureAuth, async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(200).json({ message: "Goal updated successfully", goal: updatedGoal });
  } catch (err) {
    console.error("Error updating goal:", err);
    res.status(400).json({ error: "Failed to update goal" });
  }
});


//Delete a Goal
router.delete("/:id", ensureAuth, async (req, res) => {
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  try {
    const { id } = req.params;
    const currGoal = await Goal.findById(id);
    const userId = req.user._id;

    if (!currGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const startDate = new Date(currGoal.startDate);

    for (let i = 0; i < currGoal.totalDays; i++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + i);

      const dayName = daysOfWeek[currDate.getDay()];

      if (currGoal.days.includes(dayName)) {
        await deleteTaskByGoal(toUTCStartOfDay(currDate), currGoal._id, userId);
      }
    }

    await Goal.findByIdAndDelete(id);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});


// Data of Goal Pie Chart
router.get("/:id/piechart",ensureAuth, async (req, res) => {
  let { id } = req.params;
  try {
    const goalDoc = await Goal.findById(id);
    if (!goalDoc) {
      return res.status(404).json({ error: "Goal not found" });
    }

    let startDate = new Date(goalDoc.startDate);
    let tDate = goalDoc.totalDays;

    // counters
    let restDays = 0;
    let complete = 0;
    let fail = 0;

    const today = toUTCStartOfDay(new Date());

    for (let i = 0; i < tDate; i++) {
      let date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date = toUTCStartOfDay(date);

      if (date > today) break;

      // find taskDoc of that day
      const taskDoc = await Task.findOne({ taskDate: date });

      if (!taskDoc || !Array.isArray(taskDoc.tasks)) {
        // no tasks for this day
        restDays++;
        continue;
      }

      // filter tasks for this goal
      const goalTasks = taskDoc.tasks.filter(
        t => t.goal && t.goal.toString() === id
      );

      if (goalTasks.length === 0) {
        // No task linked with this goal that day
        restDays++;
      } else {
        goalTasks.forEach(t => {
          if (t.isComplete) {
            complete++;
          } else {
            fail++;
          }
        });
      }
    }

    const data = [
      { name: "Completed", value: complete },
      { name: "Rest Days", value: restDays },
      { name: "Fail to Complete", value: fail },
    ];

    res.send(data);
  } catch (err) {
    console.error("Error accessing data:", err);
    res.status(500).json({ error: "Failed to generate Pie Chart data" });
  }
});

//For Goal of a Calender
router.get("/:id/calendar",ensureAuth, async (req, res) => {
  let { id } = req.params;
  try {
    const goalDoc = await Goal.findById(id);
    if (!goalDoc) {
      return res.status(404).json({ error: "Goal not found" });
    }
    //console.log(goalDoc);

    let startDate = new Date(goalDoc.startDate);
    let tDate = goalDoc.totalDays;

    const today = toUTCStartOfDay(new Date());
    const highlightDates = {};

    for (let i = 0; i < tDate; i++) {
      let date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date = toUTCStartOfDay(date);

      // 🚨 Stop if beyond today
      if (date > today) break;

      // console.log(date);
      // console.log("today : ", today);

      // Format YYYY-MM-DD
      const dateKey = date.toISOString().split("T")[0];

      const taskDoc = await Task.findOne({ taskDate: date });

      if (!taskDoc || !Array.isArray(taskDoc.tasks)) {
        highlightDates[dateKey] = "orange"; // rest day
        continue;
      }

      // ✅ Only check tasks with this goal ID
      const goalTasks = taskDoc.tasks.filter(
        t => t.goal && t.goal.toString() === id
      );

      if (goalTasks.length === 0) {
        highlightDates[dateKey] = "orange"; // no tasks for this goal → rest day
      } else {
        // check completion
        let allComplete = goalTasks.every(t => t.isComplete === true);
        let allFail = goalTasks.every(t => t.isComplete === false);

        if (allComplete) {
          highlightDates[dateKey] = "green"; // all completed
        } else if (allFail) {
          highlightDates[dateKey] = "red"; // all failed
        } else {
          highlightDates[dateKey] = "red"; // mixed → treat as fail
        }
      }
    }

    //console.log(highlightDates);
    res.send(highlightDates);
  } catch (err) {
    console.error("Error accessing data:", err);
    res.status(500).json({ error: "Failed to generate calendar data" });
  }
});


module.exports = router;