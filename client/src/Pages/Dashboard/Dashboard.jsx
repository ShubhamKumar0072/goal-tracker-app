import DashCard from "../../Components/Cards/DashCard";
import img6 from "./../../assets/img6.svg";
import img7 from "./../../assets/img7.svg";
import BarGraph from "./BarGraph";
import "./Dashboard.css"
import DashCalender from "./DashCalender";
import PieGraph from "./PieGraph";
import { useNavigate } from "react-router-dom";


let text1 = "Manage today’s tasks with checkboxes and add new ones for today or tomorrow.";
let text2 = "Easily add new goals and keep track of all your progress in one organized view. Stay focused, stay consistent."

let today = new Date();
let monthName = today.toLocaleString('default', { month: 'short' }); // "Aug"
// Previous month
let prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
let prevMonthName = prevMonthDate.toLocaleString('default', { month: 'short' }); // e.g., "Jul"
// Month before previous
let beforePrevMonthDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
let beforePrevMonthName = beforePrevMonthDate.toLocaleString('default', { month: 'short' }); // e.g., "Jun"

export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="Dashboard">
            <div className="Dashboard-card">
                <DashCard title="Todays Task" text={text1} img={img6} bc="#D6F0FF" onClick={() => navigate("/tasks")} />
                <DashCard title="My Goals" text={text2} img={img7} bc="#FFE9D6" onClick={() => navigate("/goals")} />
            </div>

            <div className="Dashboard-graph">
                <BarGraph />
                <PieGraph />
            </div>
            <div className="DashBord-calender">
                <div className='DashCalender'>
                    <div className="cal">
                        <DashCalender month={beforePrevMonthName}/>
                    </div>
                    <div className="cal">
                        <DashCalender month={prevMonthName}/>
                    </div>
                    <div className="cal">
                        <DashCalender month={monthName}/>
                    </div>
                </div>
            </div>
        </div>
    )
}