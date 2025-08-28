import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DashCalender.css";
import useFetch from "../../hooks/useFetch";

function DashCalender({ month }) {
  const [value, onChange] = useState(new Date());

    const { data, loading, error } = useFetch(`/dash/calendar/${month}`);
    if (loading) return <h1>Loading ....</h1>;
    if (error) return <h1>Error : {error.message}</h1>;

  // Convert example data into lookup map
  const highlightMap = {};
  data.forEach((item) => {
    highlightMap[item.date] = item.color;
  });

  // Helper to format date to YYYY-MM-DD
  const formatDate = (date) => date.toLocaleDateString("en-CA");

  return (
    <div className="DashCalender">
      <div className="cal">
        <h2>{month}</h2>
        <Calendar
          onChange={onChange}
          value={value}
          activeStartDate={new Date(`2025-${month}-01`)}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              const key = formatDate(date);
              if (highlightMap[key]) {
                return `highlight-${highlightMap[key]}`;
              }
            }
            return null;
          }}
        />
      </div>
    </div>
  );
}

export default DashCalender;