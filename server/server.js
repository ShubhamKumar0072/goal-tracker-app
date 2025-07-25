const express = require("express");
const  app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/task");
const Goal = require("./models/goal");

const corsOption = {
    origin:["http://localhost:5173"]
}
app.use(cors(corsOption));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Database SetUp
main().then(()=>{
    console.log("Successfully Connected");
})
.catch((err)=>console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}


//Get Goal List
app.get("/goals",async(req,res)=>{
    let goals = await Goal.find();
    res.send(goals);
});

//Add a new Goal
app.post("/goals", async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.status(201).json({ message: "Goal added successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save goal" });
  }
});

//View One Goal
app.get("/goals/:id", async(req,res)=>{
    let {id} = req.params;
    let goal = await Goal.findById(id);
    res.send(goal);
})

//Delete a Goal
app.delete("/goals/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
});










app.listen(8080,()=>{
    console.log("server started on port 8080");
})