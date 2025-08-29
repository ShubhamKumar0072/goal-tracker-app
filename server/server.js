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

const goal = require("./routes/goals");
app.use("/goals",goal);

const task = require("./routes/tasks");
app.use("/tasks",task);

const dash = require("./routes/dash");
app.use("/dash",dash);






app.listen(8080, () => {
  console.log("server started on port 8080");
})