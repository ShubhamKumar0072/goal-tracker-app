import OneGoalCalendar from "./OneGoalCalender";
import OneGoalPie from "./OneGoalPie";
import OneGoalTop from "./OneGoalTop";
import "./OneGoal.css";
import Button from '@mui/material/Button';
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function OneGoal() {
    const location = useLocation();
    const goalId = location.state?.goalId;
    const navigate = useNavigate();


    const { data, loading, error } = useFetch(`/goals/${goalId}`);
    if (loading) return (<h1>Looding ....</h1>);
    if (error) return (<h1>Error : {error.message} </h1>);

    async function handleDelete() {
        try {
            await axios.delete(`http://localhost:8080/goals/${goalId}`);
            alert("Goal deleted successfully");
            navigate("/goals");
        } catch (err) {
            console.error("Error deleting goal:", err);
            alert("Something went wrong while deleting");
        }
    }


    return (
        <div className="OneGoal">
            <OneGoalTop title={data.goalName} description={data.desc} />
            <div className="onegole-chart">
                <OneGoalCalendar />
                <OneGoalPie />
            </div>
            <div className="onegole-btn">
                <Button
                    variant="contained"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#1C2A3A",
                        width: 100,
                        height: 40,
                        fontSize: 15,
                        borderRadius: 2
                    }}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#ac1818ff",
                        width: 100,
                        height: 40,
                        fontSize: 15,
                        borderRadius: 2
                    }}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}