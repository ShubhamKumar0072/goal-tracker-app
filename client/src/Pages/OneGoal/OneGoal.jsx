import OneGoalCalendar from "./OneGoalCalender";
import OneGoalPie from "./OneGoalPie";
import OneGoalTop from "./OneGoalTop";
import "./OneGoal.css";
import Button from '@mui/material/Button';


export default function OneGoal(){
    return(
        <div className="OneGoal">
            <OneGoalTop/>
            <div className="onegole-chart">
                <OneGoalCalendar/>
                <OneGoalPie/>
            </div>
            <div className="onegole-btn">
                <Button
                    variant="contained" 
                    sx={{
                        display:"flex",
                        alignItems:"center",
                        backgroundColor: "#1C2A3A",
                        width:100,
                        height:40,
                        fontSize:15,
                        borderRadius:2
                    }}
                >
                    Edit
                </Button>
                <Button
                    variant="contained" 
                    sx={{
                        display:"flex",
                        alignItems:"center",
                        backgroundColor: "#ac1818ff",
                        width:100,
                        height:40,
                        fontSize:15,
                        borderRadius:2
                    }}
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}