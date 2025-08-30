import "./SignUpLogin.css";
import LinkButton from "../../Components/Buttons/LinkButton";

// filepath: c:\1.My Files\Programing\Projects\goal-tracker-app\client\src\Pages\SignUpLogin\SignUpLogin.jsx
export default function SignUpLogin() {
    return (
        <div className="SignUpLogin">
            <div className="signup-card">
                <h1>Welcome to GoalCraft</h1>
                <p className="signup-desc">
                    Track your goals, stay motivated, and achieve more. <br />
                    Sign up or log in to get started!
                </p>
                <LinkButton
                    link="http://localhost:8080/auth/google"
                    text="Continue With Google"
                    bc="#4285F4"
                    col="#fff"
                />
            </div>
        </div>
    );
}