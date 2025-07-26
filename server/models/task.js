const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({

    taskDate: {
        type: Date,
        required: true,
    },
    tasks: [
        {
            taskName: {
                type: String,
                required: true
            },
            diff: {
                type: Number,
                required: true,
                default:5,
                min:1,
                max:10
            },
            goal: {
                type: Schema.Types.ObjectId,
                ref: "Goal"
            },
            isComplete:{
                type:Boolean,
                default:false,
                required:true
            }
        }
    ]
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;