import image from "./../../assets/img3.svg"
import LinkButton from "../../Components/Buttons/LinkButton"
import "./HomeTop.css"

export default function HomeTop(){
    let text = "Build your goals with intention and track like a creator."
    let desc = "Whether you're building habits or chasing milestones, our progress tracker helps you break down big dreams into daily steps. Set intentional goals, track your momentum in real-time, and reflect on the journey—all in one intuitive space designed for growth"
    return(
        <div className="HomeTop">
            <div className="top-text">
                <h1>{text}</h1>
                <p>{desc}</p>
                <div className="top-btn" >
                    <LinkButton className="top-link" bc="#1C2A3A" col="white" text = "Join Us" link="signUp/login"/>
                </div>
            </div>
            <div className="image">
                <img className="top-img" src={image} alt="graph Image" />
            </div>
        </div>
    )
}