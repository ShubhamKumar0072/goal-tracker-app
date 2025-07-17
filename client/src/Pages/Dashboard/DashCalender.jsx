import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./DashCalender.css";

function DashCalender() {
  const [value, onChange] = useState(new Date());

  return (
    <div className='DashCalender'>
        <div className="cal">
            <h2>Jan</h2>
            <Calendar onChange={onChange} value={value} />
        </div>
        <div className="cal">
            <h2>Feb</h2>
            <Calendar onChange={onChange} value={value} />
        </div>
        <div className="cal">
            <h2>Mar</h2>
            <Calendar onChange={onChange} value={value} />
        </div>
    </div>
  );
}

export default DashCalender;