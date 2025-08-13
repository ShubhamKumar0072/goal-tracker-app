const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/task");
const Goal = require("./models/goal");
const addNewTask = require("./util/newTask");
const { deleteTaskByGoal, deleteTaskById } = require("./util/deleteTask");



const corsOption = {
  origin: ["http://localhost:5173"]
}
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function toUTCStartOfDay(localDate) {
  return new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate()
  ));
}



//Database SetUp
main().then(() => {
  console.log("Successfully Connected");
})
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}




//Get Goal List
app.get("/goals", async (req, res) => {
  let goals = await Goal.find();
  res.send(goals);
});

//Add a new Goal
app.post("/goals", async (req, res) => {
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  try {
    // Create and save the new goal first
    const newGoal = new Goal(req.body);
    await newGoal.save();

    //Saving Tasks for new Goal
    const startDate = new Date(req.body.startDate);
    for (let i = 0; i < req.body.totalDays; i++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + i);
      const dayName = daysOfWeek[currDate.getDay()];

      if (req.body.days.includes(dayName)) {
        //console.log(`Scheduling task on: ${dayName}`);
        await addNewTask(currDate, req.body.goalName, req.body.diff, newGoal._id);
      }
    }

    res.status(201).json({ message: "Goal and tasks added successfully" });

  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(500).json({ error: "Failed to save goal and tasks" });
  }
});

//View One Goal
app.get("/goals/:id", async (req, res) => {
  let { id } = req.params;
  let goal = await Goal.findById(id);
  res.send(goal);
})

//Edit a Goal
app.put("/goals/:id", async (req, res) => {
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
app.delete("/goals/:id", async (req, res) => {
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  try {
    const { id } = req.params;
    const currGoal = await Goal.findById(id);

    if (!currGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const startDate = new Date(currGoal.startDate);

    for (let i = 0; i < currGoal.totalDays; i++) {
      const currDate = new Date(startDate);
      currDate.setDate(startDate.getDate() + i);

      const dayName = daysOfWeek[currDate.getDay()];

      if (currGoal.days.includes(dayName)) {
        await deleteTaskByGoal(currDate, currGoal._id);
      }
    }

    await Goal.findByIdAndDelete(id);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error("Error deleting goal:", err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
});


//Show a Task
app.get("/tasks", async (req, res) => {
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
app.post("/tasks", async (req, res) => {
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
})



//Delete a Task
app.delete("/tasks/:id", async (req, res) => {
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
app.put("/tasks", async (req, res) => {
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

//BarGraph Data

// Previous 7 days (sum of diff per day)
app.get("/dash/bargraph", async (req, res) => {
  try {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    let result = [];

    for (let i = 6; i >= 0; i--) {
      let date = new Date(today);
      date.setDate(today.getDate() - i);
      date = toUTCStartOfDay(date);

      const taskDoc = await Task.findOne({ taskDate: date });
      //console.log(taskDoc);
      let totalDiff = 0;
      let goodDiff = 0;
      if (taskDoc && Array.isArray(taskDoc.tasks)) {
        totalDiff = taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        goodDiff = taskDoc.tasks
          .filter(t => t.isComplete === true)
          .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
      }


      result.push({
        day: daysOfWeek[date.getDay()],
        completePoint: goodDiff
      });
    }

    res.send(result);
  } catch (err) {
    console.error("Error generating bar graph data:", err);
    res.status(500).json({ error: "Failed to generate bar graph data" });
  }
});

// Previous 6 weeks (sum of diff per week)
app.get("/dash/weekgraph", async (req, res) => {
  try {
    const today = new Date();
    let result = [];

    for (let w = 5; w >= 0; w--) {
      let weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() - (w * 7));
      weekStart.setHours(0, 0, 0, 0);

      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      let sumDiff = 0;
      for (let d = 0; d < 7; d++) {
        let date = new Date(weekStart);
        date.setDate(weekStart.getDate() + d);
        date.setHours(0, 0, 0, 0);

        const taskDoc = await Task.findOne({ taskDate: date });
        if (taskDoc && Array.isArray(taskDoc.tasks)) {
          sumDiff += taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        }
      }

      result.push({
        week: `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`,
        diffSum: sumDiff
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Error generating week graph data:", err);
    res.status(500).json({ error: "Failed to generate week graph data" });
  }
});

// Previous 6 months (sum of diff per month)
app.get("/dash/monthgraph", async (req, res) => {
  try {
    const today = new Date();
    let result = [];

    for (let m = 5; m >= 0; m--) {
      let monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
      let year = monthDate.getFullYear();
      let month = monthDate.getMonth();

      let sumDiff = 0;
      let daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        let date = new Date(year, month, d);
        date.setHours(0, 0, 0, 0);

        const taskDoc = await Task.findOne({ taskDate: date });
        if (taskDoc && Array.isArray(taskDoc.tasks)) {
          sumDiff += taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        }
      }

      result.push({
        month: monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
        diffSum: sumDiff
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Error generating month graph data:", err);
    res.status(500).json({ error: "Failed to generate month graph data" });
  }
});




app.listen(8080, () => {
  console.log("server started on port 8080");
})