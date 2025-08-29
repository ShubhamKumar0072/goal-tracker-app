import { useState } from "react";
import LinkButton from "./Components/Buttons/LinkButton";
import "./Navbar.css";
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    function toggleMenu() {
        setOpen((prev) => !prev);
    }

    return (
        <nav className="Navbar">
            <div className="right">
                <MenuIcon className="navbar-icon" fontSize="large" onClick={toggleMenu} />
                <h1>GoalCraft</h1>
            </div>

            <div className={`navbar-links ${open ? "open" : ""}`}>
                <ul className="navbar-list">
                    <li className="nav-items"> <LinkButton text="Home" link="/" /> </li>
                    <li className="nav-items"> <LinkButton text="DashBoard" link="/dashboard" /> </li>
                    <li className="nav-items"> <LinkButton text="Guide" link="/guide" /> </li>
                    <li className="nav-items"> <LinkButton text="SignUp/Login" link="/singUpLogin" /></li>
                </ul>
            </div>
        </nav>
    );
}