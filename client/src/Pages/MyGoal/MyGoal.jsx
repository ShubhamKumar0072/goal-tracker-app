import AddCard from "../../Components/Cards/AddCard";
import GoalCard from "../../Components/Cards/GoalCard";
import useFetch from "../../hooks/useFetch";
import "./MyGoal.css";
import { useNavigate } from "react-router-dom";


export default function MyGoal(){
    const navigate = useNavigate();

    const{data,loading,error} = useFetch("/goals");
    if(loading) return (<h1>Looding ....</h1>);
    if(error) return(<h1>Error : {error.message} </h1>);


    return(
        <div className="MyGoal"> 
            <div className="goleCards">
                {data?.map((goal)=>(
                    <GoalCard key={goal._id} title={goal.goalName} text={goal.subLine} bc={"#FFE9D6"} onClick={()=>navigate("/one-goal", { state: { goalId: goal._id } })}/>
                ))}
            </div>
            <AddCard onClick={()=>navigate("/goal-form")}/>
        </div>
    )
}