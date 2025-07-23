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

//Database SetUp
main().then(()=>{
    console.log("Successfully Connected");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/goal_craft");
}



//Example API Call
app.get("/api",(req,res)=>{
    res.json({fruits:["a","b","c"]});
});









app.listen(8080,()=>{
    console.log("server started on port 8080");
})