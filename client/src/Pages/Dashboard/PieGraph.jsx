import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import "./PieGraph.css"

const data = [
  { name: 'Success', value: 400 },
  { name: 'Partially good', value: 300 },
  { name: 'Fail', value: 300 },
];

const COLORS = ["#57C4A3", "#FF8855", "#E65C5C"]; // green, orange, red

export default function PieGraph() {
  return (
    <div className="PieGraph" style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="80%"
            outerRadius={120}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}