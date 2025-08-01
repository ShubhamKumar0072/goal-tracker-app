import "./OneTask.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

export default function OneTask({ onEdit, label, isDone, taskId, date, goal, onDelete }) {
    async function handleDeleteClick() {
        try {
            const response = await axios.delete(`http://localhost:8080/tasks/${taskId}?date=${new Date(date).toISOString()}`);
            console.log("Deleted:", response.data);
            if (onDelete) onDelete(); // trigger parent refresh
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    function handleCheckboxChange(event) {
        const newStatus = event.target.checked;
        if (onEdit) {
            onEdit(taskId, newStatus); // Local update only
        }
    }


    return (
        <div className="OneTask">
            <div className="task-box">
                <input type="checkBox" id={`task-${taskId}`} checked={isDone} onChange={handleCheckboxChange} />
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