import React from 'react';
import img8 from "./../../assets/img8.svg";
import "./OneGoalTop.css";
import CardActionArea from '@mui/material/CardActionArea';

const OneGoalTop = ({ title, description, photoUrl }) => {
    title = title || "Running Daily";
    description = description || "Running daily is more than just a physical exercise—it's a refreshing ritual that fuels both body and mind. With each stride, it strengthens the heart, boosts stamina, and clears mental fog, setting a positive tone for the day. Whether it's the calm of sunrise or the buzz of evening, the rhythm of your footsteps becomes a grounding force, building discipline, resilience, and a subtle sense of accomplishment that lingers long after the run ends.";
    photoUrl = photoUrl || img8;
    return (
        
        <div className="one-goal-top">
            <div className="one-goal-top__text">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <img
                src={photoUrl}
                alt="Goal"
                className="one-goal-top__img"
            />
        </div>
    );
};

export default OneGoalTop;