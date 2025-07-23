const mongoose = require("mongoose");
const Goal = require("../models/goal");

//Database SetUp
main().then(()=>{
    console.log("Successfully Connected");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}

const goals = [
  {
    goalName: "Learn DSA",
    startDate:new Date("2025-07-01"),
    subLine: "Crack hard-level problems consistently",
    desc: "Focus on solving 2 medium/hard DSA problems daily",
    diff: 5,
    totalDays: 30,
    days: ["mon", "tue", "wed", "thu", "fri"],
  },
  {
    goalName: "Post on LinkedIn",
    startDate:new Date("2025-07-05"),
    subLine: "Build community and personal brand",
    desc: "Share daily progress or insights from coding journey",
    diff: 3,
    totalDays: 20,
    days: ["mon", "wed", "fri"],
  },
  {
    goalName: "Refactor Portfolio Site",
    startDate:new Date("2025-07-12"),
    subLine: "Make it aesthetic & interactive",
    desc: "Improve UI/UX and responsiveness using Material UI",
    diff: 4,
    totalDays: 15,
    days: ["tue", "thu", "sat"],
  },
  {
    goalName: "Master MERN Stack",
    startDate:new Date("2025-06-10"),
    subLine: "Solidify full-stack development skills",
    desc: "Build mini-projects using MongoDB, Express, React, Node",
    diff: 5,
    totalDays: 40,
    days: ["mon", "tue", "thu", "sat"],
  },
  {
    goalName: "Photography Practice",
    startDate:new Date("2025-06-19"),
    subLine: "Enhance composition and editing",
    desc: "Capture at least 3 photos per week and edit using Lightroom",
    diff: 2,
    totalDays: 25,
    days: ["sun", "wed", "sat"],
  },
  {
    goalName: "Read Design Principles",
    startDate:new Date("2025-07-10"),
    subLine: "Refine aesthetic understanding",
    desc: "Study color theory, typography, and layout from top design blogs",
    diff: 3,
    totalDays: 18,
    days: ["mon", "thu", "fri"],
  },
];


Goal.deleteMany({})
  .then(() => {
    console.log("All existing goals removed.");
    return Goal.insertMany(goals);
  })
  .then(() => {
    console.log("New goals successfully created!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error while updating goals:", error);
    mongoose.connection.close();
  });
