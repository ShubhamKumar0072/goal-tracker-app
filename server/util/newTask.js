const mongoose = require("mongoose");
const Task = require("../models/task");

//Database SetUp
main().then(()=>{
   // console.log("Successfully Connected");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}

async function addNewTask(date, taskName, diff, goalId) {
  try {
    const existingTaskDoc = await Task.findOne({ taskDate: new Date(date) });

    const newTask = {
      taskName,
      diff,
      goal: goalId, // optional
      isComplete: false
    };

    if (existingTaskDoc) {
      // Append to tasks array
      existingTaskDoc.tasks.push(newTask);
      await existingTaskDoc.save();
      //console.log("Task added to existing document");
    } else {
      // Create new document
      const newTaskDoc = new Task({
        taskDate: new Date(date),
        tasks: [newTask]
      });
      await newTaskDoc.save();
      //console.log("New task document created");
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

module.exports = addNewTask;