const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const goalSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    goalName: {
        type: String,
        required: true
    },
    subLine: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    diff: {
        type: Number,
        required: true,
        default: 5,
        min: 1,
        max: 10
    },
    totalDays: {
        type: Number,
        required: true
    },
    days: [{
        type: String,
        required: true,
        enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    }],
    isComplete: {
        type: Boolean,
        default: false,
        require: true
    }

});

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;