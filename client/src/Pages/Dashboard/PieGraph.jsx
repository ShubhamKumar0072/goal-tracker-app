import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import "./PieGraph.css";
import { useState, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';

const data1 = [
  { name: 'Success', value: 400 },
  { name: 'Partially good', value: 300 },
  { name: 'Fail', value: 300 },
];

const COLORS = ["#57C4A3", "#FF8855", "#E65C5C"]; // green, orange, red

export default function PieGraph() {

  const { data, loading, error } = useFetch("/dash/pie-chart");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data) {
      setChartData(data);
    }
  }, [data]);

  if (loading) return (<h1>Loading ....</h1>);
  if (error) return (<h1>Error : {error.message} </h1>);

  return (
    <div className="PieGraph" style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={chartData}
            cx="50%"
            cy="80%"
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}