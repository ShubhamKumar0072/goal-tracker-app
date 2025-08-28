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
        week: `W${1 + i}`, // Week1 ... Week6
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


//Last 180 days Data
app.get("/dash/pie-chart", async (req, res) => {
  try {
    let today = new Date();
    let win = 0;
    let lose = 0;
    let mid = 0;

    for (let i = 179; i >= 0; i--) {
      let date = new Date(today);
      date.setDate(today.getDate() - i);
      date = toUTCStartOfDay(date);

      const taskDoc = await Task.findOne({ taskDate: date });
      let totalDiff = 0;
      let goodDiff = 0;
      if (taskDoc && Array.isArray(taskDoc.tasks)) {
        totalDiff = taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        goodDiff = taskDoc.tasks
          .filter(t => t.isComplete === true)
          .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);

        let per = (goodDiff * 100) / totalDiff;
        if (!isNaN(per)) {
          if (per > 80) {
            win++;
          } else if (per >= 20) {
            mid++;
          } else {
            lose++;
          }
        }
      }
    }

    const result = [
      { name: 'Success', value: win },
      { name: 'Partially good', value: mid },
      { name: 'Fail', value: lose },
    ];

    res.send(result);

  } catch (err) {
    console.error("Error generating PieChart data:", err);
    res.status(500).json({ error: "Failed to generate Pie Chart data" });
  }
});

//Data for dashboard calender
app.get("/dash/calendar/:month", async (req, res) => {
  let { month } = req.params;

  try {

    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    const year = new Date().getFullYear(); // current year
    const monthIndex = monthMap[month];
    if (monthIndex === undefined) {
      throw new Error("Invalid month abbreviation");
    }

    const firstDate = toUTCStartOfDay(new Date(year, monthIndex, 1));
    const lastDate =toUTCStartOfDay(new Date(year, monthIndex + 1, 0));

    let i =0;
    let result = [];
    while(true) {
      let date = new Date(firstDate);
      date.setDate(firstDate.getDate() + i);
      i++;
      date = toUTCStartOfDay(date);
      let Fdate =date.toLocaleDateString('en-CA');

      if(date>lastDate || date > toUTCStartOfDay(new Date())) break;

      const taskDoc = await Task.findOne({ taskDate: date });
      let totalDiff = 0;
      let goodDiff = 0;
      if (taskDoc && Array.isArray(taskDoc.tasks)) {
        totalDiff = taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        goodDiff = taskDoc.tasks
          .filter(t => t.isComplete === true)
          .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);

        let per = (goodDiff * 100) / totalDiff;
        if (!isNaN(per)) {
          if (per > 80) {
            result.push({date:Fdate,color:"green1"});
          } else if (per >= 50) {
            result.push({date:Fdate,color:"green2"});
          }else if(per >= 20){
            result.push({date:Fdate,color:"green3"});
          } else {
            result.push({date:Fdate,color:"green4"});
          }
        }
      }
    }
    // console.log("Month Name : ", month);
    // console.log(result);
    res.send(result);
  } catch (err) {
    console.error("Error accessing data:", err);
    res.status(500).json({ error: "Failed to generate Calender View" });
  }
});


// Data of Goal Pie Chart
app.get("/goals/:id/piechart", async (req, res) => {
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



// Data for Calendar Highlighting (goal-specific)

app.get("/goals/:id/calendar", async (req, res) => {
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




app.listen(8080, () => {
  console.log("server started on port 8080");
})