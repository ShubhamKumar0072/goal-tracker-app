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
    taskDate:new Date("2026-03-12"),
    task:[
        {
            taskName:"Wake up in Mornig",
            diff:5,
            disc:"Have to Wake Up in 4:30 AM for work"
        },
        {
            taskName:"Eate Healthy",
            diff:4,
            disc:"Improving metabolism is nessasary"
        },
        {
            taskName:"Running",
            diff:8,
            disc:"Runnig should be at morning is important"
        },
        {
            taskName:"Sleep Early",
            diff:4,
            disc:"Go to bed at 10:30 PM or less then that"
        },   
    ]
});


Task.deleteMany({})
.then(()=>{
    taskforDay.save()
})
.then(()=>{
    console.log("Task saved");
    mongoose.connection.close();
})
.catch((error) => {
    console.error("Error while updating goals:", error);
    mongoose.connection.close();
});

