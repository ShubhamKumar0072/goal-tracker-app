const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/task");
const Goal = require("./models/goal");
const addNewTask = require("./util/newTask");
const {deleteTaskByGoal,deleteTaskById} = require("./util/deleteTask");



const corsOption = {
  origin: ["http://localhost:5173"]
}
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.post("/tasks",async(req,res)=>{
  try{
    //console.log("arrived Date = ",req.query.date);
    const date = new Date(req.query.date);
    // const taskName = req.body.taskName;
    // console.log(task);
    addNewTask(date, req.body.taskName, req.body.diff);
    res.status(200).json({ message: "Task Added successfully" });
  }catch(err){
    res.status(500).json({error: "Failed to add task"});
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









app.listen(8080, () => {
  console.log("server started on port 8080");
})