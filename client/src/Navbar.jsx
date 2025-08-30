import { useState } from "react";
import LinkButton from "./Components/Buttons/LinkButton";
import "./Navbar.css";
import MenuIcon from '@mui/icons-material/Menu';
import useFetch from "./hooks/useFetch"; // Make sure this import is correct

export default function Navbar() {
    const [open, setOpen] = useState(false);

    function toggleMenu() {
        setOpen((prev) => !prev);
    }

    const { data, loading, error } = useFetch(`/check-login`);
    if (loading) return (<h1>Loading ....</h1>);
    if (error) return (<h1>Error : {error.message} </h1>);

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
                    {!data?.loggedIn && (
                        <li className="nav-items">
                            <LinkButton text="SignUp/Login" link="/singUpLogin" />
                        </li>
                    )}
                    {data?.loggedIn && (
                        <li className="nav-items">
                            <LinkButton text="Logout" link="/logout" />
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}