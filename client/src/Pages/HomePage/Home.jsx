import img4 from "./../../assets/img4.svg"
import img5 from "./../../assets/img5.svg"
import img1 from "./../../assets/img1.svg"
import { FeatureCard } from "../../Components/Cards/FeatureCard";
import HomeTop from "./HomeTop";
import Steps from "./Steps";
import useFetch from "../../hooks/useFetch";
 
const features = [
    {
        tital: "Progress Visualization",
        desc: "Track your goals with intuitive charts and progress bars for clear motivation.",
        img: img4
    },
    {
        tital: "Task Management",
        desc: "Organize your daily tasks and subtasks to stay on top of your objectives.",
        img: img1
    },
    {
        tital: "Reminders & Notifications",
        desc: "Never miss a deadline with smart reminders and timely notifications.",
        img: img5
    }
];

export default function Home(){
    return(
        <div>
            <HomeTop/>
            {features.map((feature, idx) => (
                <FeatureCard
                    key={idx}
                    tital={feature.tital}
                    desc={feature.desc}
                    img={feature.img}
                    rev={(idx) % 2 !== 0}
                />
            ))}
            <hr />
            <Steps/>
        </div>
    )
}