import React, { useState } from "react";
import "./DayPicker.css";
// filepath: c:\1.My Files\Programing\Projects\gole-tracker-app\client\src\Components\FormElements\DayPicker.jsx

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function DayPicker() {
  const [selected, setSelected] = useState(Array(7).fill(false));

  function handleLabelClick(idx) {
    setSelected(sel => {
      const copy = [...sel];
      copy[idx] = !copy[idx];
      return copy;
    });
  }

  return (
    <div className="DayPicker">
      {days.map((day, idx) => (
        <React.Fragment key={day}>
          <input
            type="checkbox"
            id={day}
            name={day.toLowerCase()}
            checked={selected[idx]}
            style={{ display: "none" }}
            readOnly
          />
          <label
            htmlFor={day}
            className={selected[idx] ? "selected" : ""}
            onClick={() => handleLabelClick(idx)}
          >
            {day}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}