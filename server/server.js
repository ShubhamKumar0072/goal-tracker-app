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
app.get("/dash/bargraph-day", async (req, res) => {
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

// Last 6 weeks (sum of diff per week)
app.get("/dash/bargraph-weeks", async (req, res) => {
  try {
    const today = new Date();
    let result = [];

    // Loop for last 6 weeks
    for (let i = 5; i >= 0; i--) {
      let startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() - (i * 7)); // Sunday
      startOfWeek = toUTCStartOfDay(startOfWeek);

      let endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      endOfWeek = toUTCStartOfDay(endOfWeek);

      //console.log(startOfWeek,endOfWeek);

      // Fetch all tasks within this week
      const taskDocs = await Task.find({
        taskDate: { $gte: startOfWeek, $lte: endOfWeek }
      });

      let totalDiff = 0;
      let goodDiff = 0;

      taskDocs.forEach(doc => {
        if (Array.isArray(doc.tasks)) {
          totalDiff += doc.tasks.reduce(
            (acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0),
            0
          );
          goodDiff += doc.tasks
            .filter(t => t.isComplete === true)
            .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        }
      });

      result.push({
        week: `W${1+i}`, // Week1 ... Week6
        completePoint: goodDiff,
        totalPoint: totalDiff
      });
    }

    res.send(result);
  } catch (err) {
    console.error("Error generating weekly bar graph data:", err);
    res.status(500).json({ error: "Failed to generate weekly bar graph data" });
  }
});


// Last 6 months (month name wise)
app.get("/dash/bargraph-months", async (req, res) => {
  try {
    const today = new Date();
    let result = [];

    // Loop for last 6 months
    for (let i = 5; i >= 0; i--) {
      let firstDay = new Date(today.getFullYear(), today.getMonth() - i, 1);
      firstDay = toUTCStartOfDay(firstDay);

      let lastDay = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      lastDay = toUTCStartOfDay(lastDay);

      // Fetch all tasks within this month
      const taskDocs = await Task.find({
        taskDate: { $gte: firstDay, $lte: lastDay }
      });

      let totalDiff = 0;
      let goodDiff = 0;

      taskDocs.forEach(doc => {
        if (Array.isArray(doc.tasks)) {
          totalDiff += doc.tasks.reduce(
            (acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0),
            0
          );
          goodDiff += doc.tasks
            .filter(t => t.isComplete === true)
            .reduce(
              (acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0),
              0
            );
        }
      });

      // Month short name (Jan, Feb, etc.)
      const monthName = firstDay.toLocaleString("default", { month: "short" });

      result.push({
        month: monthName,
        completePoint: goodDiff,
        totalPoint: totalDiff
      });
    }

    res.send(result);
  } catch (err) {
    console.error("Error generating monthly bar graph data:", err);
    res.status(500).json({ error: "Failed to generate monthly bar graph data" });
  }
});


app.listen(8080, () => {
  console.log("server started on port 8080");
})