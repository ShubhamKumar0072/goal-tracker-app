import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./OneGoalCalender.css";

function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className='OneGoalCalender' style={{ maxWidth: '350px',textAlign:"center"}}>
      <h2>See Your Progress</h2>
      <Calendar onChange={setDate} value={date} />
    </div>
  );
}

export default MyCalendar;