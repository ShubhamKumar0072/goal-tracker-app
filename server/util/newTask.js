const mongoose = require("mongoose");
const Task = require("../models/task");

// //Database SetUp
// const dbURL = process.env.ATLASDB_URL;
// main().then(() => {
//   console.log("Successfully Connected3");
// })
//   .catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(dbURL);
// }

async function addNewTask(date, taskName, diff, userId, goalId) {
  try {
    const existingTaskDoc = await Task.findOne({
      taskDate: new Date(date),
      userId: userId
    });

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
    } else {
      // Create new document
      const newTaskDoc = new Task({
        taskDate: new Date(date),
        userId: userId,
        tasks: [newTask]
      });
      await newTaskDoc.save();
    }
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

module.exports = addNewTask;