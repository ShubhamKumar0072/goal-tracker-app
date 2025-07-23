const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    
    taskDate:{
        type:Date,
        required:true,
    },
    task:[
        {
        taskName:{
            type:String,
            required:true
        },
        disc:{
            type:String,
            required:true
        },
        diff:{
            type:Number,
            required:true,
        },
        }
    ]
});

const Task = mongoose.model("Task",taskSchema);
module.exports = Task;