const mongoose = require("mongoose");
const Task = require("../models/task");

//Database SetUp
main().then(() => {
    //console.log("Successfully Connected");
})
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}

async function deleteTaskByGoal(date, GoalId) {
  try {
    const existingTaskDoc = await Task.findOne({ taskDate: new Date(date) });

    if (!existingTaskDoc) {
      console.warn("No task document found for the given date.");
      return;
    }

    // Pull the task with matching goal
    await Task.updateOne(
      { _id: existingTaskDoc._id },
      { $pull: { tasks: { goal: GoalId } } }
    );

    // Re-fetch to check if tasks array is now empty
    const updatedDoc = await Task.findById(existingTaskDoc._id);

    if (updatedDoc.tasks.length === 0) {
      await Task.deleteOne({ _id: updatedDoc._id });
      console.log("Task document deleted as tasks array became empty.");
    } else {
      console.log(`Task with goal ${GoalId} deleted successfully.`);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

module.exports = deleteTaskByGoal;