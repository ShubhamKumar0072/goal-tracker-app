import StepCard from "../../Components/Cards/StepCard"
import "./Steps.css"

const goalSteps = [
  "Define what you want to achieve—be specific. Choose a category like fitness, learning, or productivity and give your goal a motivating title.",
  "Set a realistic deadline. Break your goal into smaller tasks or milestones so you can measure progress clearly along the way.",
  "Choose how often you'll work on it—daily, weekly, or custom. Enable reminders to help build consistency and prevent procrastination.",
  "Review your goal setup and confirm. Your tracker will now show updates, log progress, and celebrate key milestones as you move forward."
];


export default function Steps(){
    return(
        <div className="Steps">
            <h1>Four Easy Steps to go</h1>
            <div className="step">
                <StepCard num = "01" text={goalSteps[0]} bc="#D6FFF6"/>
                <StepCard num = "02" text={goalSteps[1]} bc="#FFE9D6"/>
                <StepCard num = "03" text={goalSteps[2]} bc="#D6FFE6"/>
                <StepCard num = "04" text={goalSteps[3]} bc="#FFFBD6"/>
            </div>

        </div>
    )
}