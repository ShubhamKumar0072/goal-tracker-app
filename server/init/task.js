const mongoose = require("mongoose");
const Task = require("../models/task");

//Database SetUp
main().then(()=>{
    console.log("Successfully Connected");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}

const taskforDay = new Task({
    taskDate:new Date("2025-07-28"),
    tasks:[
        {
            taskName:"Wake up in Mornig",
            diff:5
        },
        {
            taskName:"Eate Healthy",
            diff:4
        },
        {
            taskName:"Running",
            diff:8
        },
        {
            taskName:"Sleep Early",
            diff:4
        },   
    ]
});


Task.deleteMany({})
.then(()=>{
    taskforDay.save()
})
.then(()=>{
    console.log("Task saved");
})
.catch((error) => {
    console.error("Error while updating goals:", error);
    mongoose.connection.close();
});

