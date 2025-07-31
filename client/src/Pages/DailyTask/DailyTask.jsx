import Calendar from 'react-calendar';
import Button from '@mui/material/Button';
import useFetch from '../../hooks/useFetch';
import TextBox from '../../Components/FormElements/TextBox';
import MySlider from '../../Components/FormElements/MySlider';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import "./DailyTask.css";
import OneTask from './OneTask';



function toUTCStartOfDay(localDate) {
    return new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
    ));
}


export default function DailyTask() {
    const [date, setDate] = useState(new Date());
    const [data, setData] = useState(null);


    //Function to access Data
    async function fetchTasks() {
        try {
            const date2 = toUTCStartOfDay(date);
            const response = await axios.get(`http://localhost:8080/tasks?date=${date2.toISOString()}`);
            setData(response.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }

    // Update data when date changes
    useEffect(() => {
        fetchTasks();
    }, [date]);


    //New Task Form
    const [newTask, setNewTask] = useState("");
    const [diff, setDiff] = useState(5);
    function handleNewTask(event) {
        setNewTask(event.target.value);
    }
    function handelDiff(event) {
        setDiff(Number(event.target.value));
    }


    //Handel new Task Addition
    async function handleTaskAdd(e) {
        e.preventDefault();
        let data = {
            taskName: newTask,
            diff: diff,
            isComplete: false,
        }
        try {
            let date2 = toUTCStartOfDay(date);
            const response = await axios.post(`http://localhost:8080/tasks?date=${date2.toISOString()}`, data);
            console.log("Success:", response.data);
            setNewTask("");
            setDiff(5);
            fetchTasks();
        } catch (error) {
            console.error("Error submitting Task:", error);
        }
    }

    //Submit task form
    function taskHandelEdit(taskId, newStatus) {
        setData(prevData => {
            if (!prevData || !prevData.tasks) return prevData;

            const updatedTasks = prevData.tasks.map(task =>
                task._id === taskId ? { ...task, isComplete: newStatus } : task
            );

            return { ...prevData, tasks: updatedTasks };
        });
    }

    //When Submit Clicked
    async function handleSubmitAll(e) {
        e.preventDefault();

        if (!data?.tasks || data.tasks.length === 0) {
            console.warn("No tasks to submit.");
            return;
        }

        const dateUTC = toUTCStartOfDay(date).toISOString();

        try {
            const response = await axios.put(`http://localhost:8080/tasks?date=${dateUTC}`, {
                tasks: data.tasks.map(task => ({
                    taskName: task.taskName,
                    diff: task.diff,
                    goal: task.goal || null,
                    isComplete: task.isComplete
                }))
            });

            console.log("Tasks updated successfully:", response.data);
            fetchTasks(); // Refresh the task list after update
        } catch (error) {
            console.error("Error updating tasks:", error);
        }
    }



    return (
        <div className="DailyTask">
            <div className='taskForm'>
                <form action="">
                    <h1>
                        Submit before 02:00 AM{date ? ` || ${date.toLocaleDateString()}` : ''}
                    </h1>
                    {data?.tasks?.length > 0 ? (
                        data.tasks.map((task) => (
                            <OneTask
                                key={task._id}
                                taskId={task._id}
                                label={task.taskName}
                                isDone={task.isComplete}
                                date={toUTCStartOfDay(date)}
                                goal={task.goal}
                                onDelete={() => fetchTasks()}
                                onEdit={taskHandelEdit}
                            />

                        ))
                    ) : (
                        <p>No tasks found for this date.</p>
                    )}
                    <Button
                        variant="contained"
                        onClick={handleSubmitAll}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#1C2A3A",
                            width: 100,
                            height: 40,
                            fontSize: 15,
                            borderRadius: 2,
                            mx: "auto"
                        }}
                    >
                        Submit
                    </Button>
                </form>
                <form action="" className='new-taskForm' onSubmit={handleTaskAdd}>
                    <TextBox placeholder="Running" type="text" lable="New Task Name" val={newTask} handel={handleNewTask} name="taskName" id="newTask" required />
                    <MySlider lable="Difficulty Level" name="diff" val={diff} id="diff" handel={handelDiff} required />
                    <Button
                        variant="contained"
                        type='submit'
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#1C2A3A",
                            width: 100,
                            height: 40,
                            fontSize: 15,
                            borderRadius: 2,
                            mx: "auto"
                        }}
                    >
                        Add
                    </Button>
                </form>
            </div>
            <div className="daily-task-calander">
                <Calendar onChange={setDate} value={date} />
            </div>
        </div>
    );
}