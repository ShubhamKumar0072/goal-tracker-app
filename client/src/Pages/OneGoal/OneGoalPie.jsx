import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import useFetch from "../../hooks/useFetch";

const COLORS = ["#4CAF50", "#FF9800", "#E53935"];

function OneGoalPie({ goalId }) {
    const { data, loading, error } = useFetch(`/goals/${goalId}/piechart`);
    if (loading) return (<h1>Looding ....</h1>);
    if (error) return (<h1>Error : {error.message} </h1>);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "1.5rem" }}>
            <PieChart width={250} height={250}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
            <div style={{}}>
                {data.map((entry, idx) => (
                    <div key={entry.name} style={{ color: COLORS[idx], margin: "4px 0", fontSize: 25, textAlign: "center" }}>
                        {entry.name}: {entry.value}
                    </div>
                ))}
            </div>
        </div>
    )
};

export default OneGoalPie;