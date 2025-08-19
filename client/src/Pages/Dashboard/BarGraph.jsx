import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import "./BarGraph.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useFetch from '../../hooks/useFetch';

let btnStyle = {color:"#333333", fontSize:"18px", fontWeight:"500", backgroundColor: "#F5D6FF", borderRadius:"15px"}

const BarGraph = () => {
    // Fetch all three datasets
    const { data: dayData, loading, error } = useFetch("/dash/bargraph-day");
    const { data: weekData } = useFetch("/dash/bargraph-weeks");
    const { data: monthData } = useFetch("/dash/bargraph-months");

    // Chart data and label key
    const [chartData, setChartData] = useState([]);
    const [labelKey, setLabelKey] = useState("day");

    // Set initial data to dayData
    useEffect(() => {
      if (dayData) {
        setChartData(dayData);
        setLabelKey("day");
      }
    }, [dayData]);

    // Button handlers
    function change1() {
        setChartData(dayData || []);
        setLabelKey("day");
    }
    function change2() {
        setChartData(weekData || []);
        setLabelKey("week");
    }
    function change3() {
        setChartData(monthData || []);
        setLabelKey("month");
    }

    if (loading) return (<h1>Loading ....</h1>);
    if (error) return(<h1>Error : {error.message} </h1>);

    return (
        <div className='BarGraph' style={{ width: "100%", maxWidth: 700 }}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <XAxis dataKey={labelKey} />
                    <YAxis />
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="completePoint" fill="#FF6F61" radius={[20, 20, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <div className="graph-btn">
                <Button variant="text" onClick={change1} sx={btnStyle} >Day</Button>
                <Button variant="text" onClick={change2} sx={btnStyle}>Week</Button>
                <Button variant="text" onClick={change3} sx={btnStyle}>Month</Button>
            </div>
        </div>
    )
};

export default BarGraph;