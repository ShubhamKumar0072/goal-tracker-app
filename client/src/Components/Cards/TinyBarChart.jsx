import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';

const data = [
  { name: 'Work Days', value: 12 },
  { name: 'Rest Days', value: 18 },
  { name: 'Fail', value: 10 },
];

const TinyBarChart = () => {
  return (
    <div style={{width:220, height:100}}>
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 15, left: 80, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="value" fill="#8884d8" barSize={12} radius={[3, 3, 3, 3]} >
            <LabelList dataKey="name" position="left" style={{ fill: 'black', fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TinyBarChart;