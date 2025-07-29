import "./OneTask.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

export default function OneTask({ handel, label, isDone, taskId, date, goal, onDelete }) {
    async function handleDeleteClick() {
        try {
            const response = await axios.delete(`http://localhost:8080/tasks/${taskId}?date=${new Date(date).toISOString()}`);
            console.log("Deleted:", response.data);
            if (onDelete) onDelete(); // trigger parent refresh
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    return (
        <div className="OneTask">
            <div className="task-box">
                <input type="checkBox" id={`task-${taskId}`} checked={isDone} onChange={handel} />
                <label htmlFor={`task-${taskId}`}>{label}</label>
            </div>

            {!goal && (
                <IconButton aria-label="delete" color="error" onClick={handleDeleteClick}>
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
    );
}