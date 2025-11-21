import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './ChartPatientOverview.css';

const ChartPatientOverview = () => {
  const pieData = [
    { name: "Child", value: 200, color: "#7DD3FC" },
    { name: "Teen", value: 300, color: "#C084FC" },
    { name: "Adult", value: 350, color: "#38BDF8" },
    { name: "Older", value: 136, color: "#FBBF24" },
  ];

  return (
    <div className="chart2">
      <h3>Patient</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ChartPatientOverview;