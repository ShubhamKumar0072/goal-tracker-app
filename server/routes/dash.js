const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Goal = require("../models/goal");
const addNewTask = require("../util/newTask");
const { deleteTaskByGoal, deleteTaskById } = require("../util/deleteTask");
const { route } = require("./goals");
const toUTCStartOfDay = require("../util/dateFunc");
const ensureAuth = require("../middleware");


// Previous 7 days (sum of diff per day)
router.get("/bargraph-day",ensureAuth, async (req, res) => {
  try {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    let result = [];
    const userId = req.user._id;

    for (let i = 6; i >= 0; i--) {
      let date = new Date(today);
      date.setDate(today.getDate() - i);
      date = toUTCStartOfDay(date);

      const taskDoc = await Task.findOne({ taskDate: date, userId });
      //console.log(taskDoc);
      let totalDiff = 0;
      let goodDiff = 0;
      if (taskDoc && Array.isArray(taskDoc.tasks)) {
        totalDiff = taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        goodDiff = taskDoc.tasks
          .filter(t => t.isComplete === true)
          .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
      }


      result.push({
        day: daysOfWeek[date.getDay()],
        completePoint: goodDiff
      });
    }

    res.send(result);
  } catch (err) {
    console.error("Error generating bar graph data:", err);
    res.status(500).json({ error: "Failed to generate bar graph data" });
  }
});



// Last 6 weeks (sum of diff per week)
router.get("/bargraph-weeks",ensureAuth, async (req, res) => {
  try {
    const today = new Date();
    let result = [];
    const userId = req.user._id;

    // Loop for last 6 weeks
    for (let i = 5; i >= 0; i--) {
      let startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() - (i * 7)); // Sunday
      startOfWeek = toUTCStartOfDay(startOfWeek);

      let endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      endOfWeek = toUTCStartOfDay(endOfWeek);

      //console.log(startOfWeek,endOfWeek);

      // Fetch all tasks within this week
      const taskDocs = await Task.find({
        taskDate: { $gte: startOfWeek, $lte: endOfWeek },
        userId
      });

      let totalDiff = 0;
      let goodDiff = 0;

      taskDocs.forEach(doc => {
        if (Array.isArray(doc.tasks)) {
          totalDiff += doc.tasks.reduce(
            (acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0),
            0
          );
          goodDiff += doc.tasks
            .filter(t => t.isComplete === true)
            .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        }
      });

      result.push({
        week: `W${1 + i}`, // Week1 ... Week6
        completePoint: goodDiff,
        totalPoint: totalDiff
      });
    }

    res.send(result);
  } catch (err) {
    console.error("Error generating weekly bar graph data:", err);
    res.status(500).json({ error: "Failed to generate weekly bar graph data" });
  }
});

// Last 6 months (month name wise)
router.get("/bargraph-months",ensureAuth, async (req, res) => {
  try {
    const today = new Date();
    let result = [];
    const userId = req.user._id;

    // Loop for last 6 months
    for (let i = 5; i >= 0; i--) {
      let firstDay = new Date(today.getFullYear(), today.getMonth() - i, 1);
      firstDay = toUTCStartOfDay(firstDay);

      let lastDay = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      lastDay = toUTCStartOfDay(lastDay);

      // Fetch all tasks within this month
      const taskDocs = await Task.find({
        taskDate: { $gte: firstDay, $lte: lastDay },
        userId
      });

      let totalDiff = 0;
      let goodDiff = 0;

      taskDocs.forEach(doc => {
        if (Array.isArray(doc.tasks)) {
          totalDiff += doc.tasks.reduce(
            (acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0),
            0
          );
          goodDiff += doc.tasks
            .filter(t => t.isComplete === true)
            .reduce(
              (acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0),
              0
            );
        }
      });

      // Month short name (Jan, Feb, etc.)
      const monthName = firstDay.toLocaleString("default", { month: "short" });

      result.push({
        month: monthName,
        completePoint: goodDiff,
        totalPoint: totalDiff
      });
    }

    res.send(result);
  } catch (err) {
    console.error("Error generating monthly bar graph data:", err);
    res.status(500).json({ error: "Failed to generate monthly bar graph data" });
  }
});


//Last 180 days Data
router.get("/pie-chart",ensureAuth, async (req, res) => {
  try {
    let today = new Date();
    let win = 0;
    let lose = 0;
    let mid = 0;
    const userId = req.user._id;

    for (let i = 179; i >= 0; i--) {
      let date = new Date(today);
      date.setDate(today.getDate() - i);
      date = toUTCStartOfDay(date);

      const taskDoc = await Task.findOne({ taskDate: date,userId });
      let totalDiff = 0;
      let goodDiff = 0;
      if (taskDoc && Array.isArray(taskDoc.tasks)) {
        totalDiff = taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        goodDiff = taskDoc.tasks
          .filter(t => t.isComplete === true)
          .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);

        let per = (goodDiff * 100) / totalDiff;
        if (!isNaN(per)) {
          if (per > 80) {
            win++;
          } else if (per >= 20) {
            mid++;
          } else {
            lose++;
          }
        }
      }
    }

    const result = [
      { name: 'Success', value: win },
      { name: 'Partially good', value: mid },
      { name: 'Fail', value: lose },
    ];

    res.send(result);

  } catch (err) {
    console.error("Error generating PieChart data:", err);
    res.status(500).json({ error: "Failed to generate Pie Chart data" });
  }
});


//Data for dashboard calender
router.get("/calendar/:month",ensureAuth, async (req, res) => {
  let { month } = req.params;

  try {
    const userId = req.user._id;
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    const year = new Date().getFullYear(); // current year
    const monthIndex = monthMap[month];
    if (monthIndex === undefined) {
      throw new Error("Invalid month abbreviation");
    }

    const firstDate = toUTCStartOfDay(new Date(year, monthIndex, 1));
    const lastDate =toUTCStartOfDay(new Date(year, monthIndex + 1, 0));

    let i =0;
    let result = [];
    while(true) {
      let date = new Date(firstDate);
      date.setDate(firstDate.getDate() + i);
      i++;
      date = toUTCStartOfDay(date);
      let Fdate =date.toLocaleDateString('en-CA');

      if(date>lastDate || date > toUTCStartOfDay(new Date())) break;

      const taskDoc = await Task.findOne({ taskDate: date, userId });
      let totalDiff = 0;
      let goodDiff = 0;
      if (taskDoc && Array.isArray(taskDoc.tasks)) {
        totalDiff = taskDoc.tasks.reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);
        goodDiff = taskDoc.tasks
          .filter(t => t.isComplete === true)
          .reduce((acc, t) => acc + (typeof t.diff === "number" ? t.diff : 0), 0);

        let per = (goodDiff * 100) / totalDiff;
        if (!isNaN(per)) {
          if (per > 80) {
            result.push({date:Fdate,color:"green1"});
          } else if (per >= 50) {
            result.push({date:Fdate,color:"green2"});
          }else if(per >= 20){
            result.push({date:Fdate,color:"green3"});
          } else {
            result.push({date:Fdate,color:"green4"});
          }
        }
      }
    }
    // console.log("Month Name : ", month);
    // console.log(result);
    res.send(result);
  } catch (err) {
    console.error("Error accessing data:", err);
    res.status(500).json({ error: "Failed to generate Calender View" });
  }
});

module.exports = router;