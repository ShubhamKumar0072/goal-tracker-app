import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./OneGoalCalender.css";
import useFetch from '../../hooks/useFetch';

function MyCalendar({ goalId }) {
  const [date, setDate] = useState(new Date());

  // Fetch highlight data from backend
  const { data: highlightDates, loading, error } = useFetch(`/goals/${goalId}/calendar`);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date) => date.toLocaleDateString("en-CA");

  if (loading) return <h1>Loading ....</h1>;
  if (error) return <h1>Error : {error.message}</h1>;

  //console.log(highlightDates); e.g. { "2025-08-30": "red", "2025-09-02": "orange" }

  return (
    <div className='OneGoalCalender' style={{ maxWidth: '350px', textAlign: "center" }}>
      <h2>See Your Progress</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const key = formatDate(date);
            if (highlightDates && highlightDates[key]) {
              return `highlight-${highlightDates[key]}`; // dynamic class e.g. highlight-red
            }
          }
          return null;
        }}
      />
    </div>
  );
}

export default MyCalendar;
