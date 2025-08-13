import React, { useState,useEffect } from 'react';
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

const data2 = [
  { name: 'Week1', uv: 9000 },
  { name: 'Week2', uv: 2000 },
  { name: 'Week3', uv: 1000 },
  { name: 'Week4', uv: 10000 },
  { name: 'Week5', uv: 27180 },
  { name: 'Week6', uv: 18970 },
];

const data3 = [
  { name: 'Jan', uv: 10000 },
  { name: 'Feb', uv: 8000 },
  { name: 'March', uv: 12000 },
  { name: 'April', uv: 24000 },
  { name: 'May', uv: 20780 },
  { name: 'June', uv: 10890 },
];

let btnStyle = {color:"#333333", fontSize:"18px", fontWeight:"500", backgroundColor: "#F5D6FF", borderRadius:"15px"}


// ...existing imports and code...

const BarGraph = () => {

    const { data, loading, error } = useFetch("/dash/bargraph");
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
      if (data) setChartData(data);
    }, [data]);

    console.log(data);
    console.log(chartData);

    if (loading) return (<h1>Loading ....</h1>);
    if (error) return(<h1>Error : {error.message} </h1>);

    function change1() {
        setChartData(data);
    }
    function change2(event){
        setData(data2);
    }
    function change3(event){
        setData(data3);
    }
    return (
        <div className='BarGraph' style={{ width: "100%", maxWidth: 700, }}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <XAxis dataKey="day" />
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