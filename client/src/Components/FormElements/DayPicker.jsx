import React, { useState, useEffect } from "react";
import "./DayPicker.css";

const daysList = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default function DayPicker({ onSelectDays }) {
  const [selected, setSelected] = useState(Array(7).fill(false));

  // Callback inside useEffect (safe and runs only when `selected` changes)
  useEffect(() => {
    if (typeof onSelectDays === "function") {
      const activeDays = daysList.filter((_, i) => selected[i]);
      onSelectDays(activeDays);
    }
  }, [selected]); // Only trigger when selected days change

  function handleLabelClick(idx) {
    setSelected(prev => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  }

  return (
    <div className="DayPicker">
      {daysList.map((day, idx) => (
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
            {day.toUpperCase()}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}