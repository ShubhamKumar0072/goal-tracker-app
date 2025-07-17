import AddCard from "../../Components/Cards/AddCard";
import GoalCard from "../../Components/Cards/GoalCard";
import "./MyGoal.css";
import { useNavigate } from "react-router-dom";

export default function MyGoal(){
    const navigate = useNavigate();
    return(
        <div className="MyGoal"> 
            <div className="goleCards">
            <GoalCard title={"Running"} text={"I have to run faster then ever"} bc={"#FFE9D6"} onClick={()=>navigate("/one-goal")}/>
            <GoalCard title={"Running"} text={"I have to run faster then ever"} bc={"#FFE9D6"}/>
            <GoalCard title={"Running"} text={"I have to run faster then ever"} bc={"#FFE9D6"}/>
            </div>
            <AddCard onClick={()=>navigate("/goal-form")}/>
        </div>
    )
}