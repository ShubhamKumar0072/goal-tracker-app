const mongoose = require("mongoose");
const Task = require("../models/task");

// //Database SetUp
// const dbURL = process.env.ATLASDB_URL;
// main().then(() => {
//   console.log("Successfully Connected2");
// })
//   .catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(dbURL);
// }

async function deleteTaskByGoal(date, goalId, userId) {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.warn("Invalid date format.");
      return;
    }

    // Find the task document scoped to the user
    const existingTaskDoc = await Task.findOne({ taskDate: parsedDate, userId });

    if (!existingTaskDoc) {
      console.warn("No task document found for the given date and user.");
      return;
    }

    // Check if any task matches the goal
    const hasMatchingGoal = existingTaskDoc.tasks.some(
      task => task.goal && task.goal.toString() === goalId.toString()
    );
    if (!hasMatchingGoal) {
      console.warn("No task with the specified goal found.");
      return;
    }

    // Pull the task with matching goal
    await Task.updateOne(
      { _id: existingTaskDoc._id },
      { $pull: { tasks: { goal:  goalId } } }
    );

    // Re-fetch to check if tasks array is now empty
    const updatedDoc = await Task.findById(existingTaskDoc._id);

    if (!updatedDoc.tasks || updatedDoc.tasks.length === 0) {
      await Task.deleteOne({ _id: updatedDoc._id });
    }
  } catch (error) {
    console.error("Error deleting task by goal:", error);
  }
}


async function deleteTaskById(date, taskId, userId) {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      console.warn("Invalid date format.");
      return;
    }

    // Find the task document scoped to the user
    const existingTaskDoc = await Task.findOne({ taskDate: parsedDate, userId });

    if (!existingTaskDoc) {
      console.warn("No task document found for the given date and user.");
      return;
    }

    // Find the specific task inside the tasks array
    const taskToDelete = existingTaskDoc.tasks.find(task => task._id.toString() === taskId);

    if (!taskToDelete) {
      console.warn("Task not found in the document.");
      return;
    }

    // Prevent deletion if task has a goal
    if (taskToDelete.goal) {
      console.warn("Cannot delete task linked to a goal.");
      return;
    }

    // Proceed with deletion
    await Task.updateOne(
      { _id: existingTaskDoc._id },
      { $pull: { tasks: { _id: taskId } } }
    );

    // Re-fetch to check if tasks array is now empty
    const updatedDoc = await Task.findById(existingTaskDoc._id);

    if (!updatedDoc.tasks || updatedDoc.tasks.length === 0) {
      await Task.deleteOne({ _id: updatedDoc._id });
      //console.log("Task document deleted as tasks array became empty.");
    } else {
      //console.log(`Task with ID ${taskId} deleted successfully.`);
    }
  } catch (error) {
    console.error("Error deleting task by ID:", error);
  }
}
module.exports = { deleteTaskByGoal, deleteTaskById };