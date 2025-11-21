import React from 'react';
import './DashboardCards.css';


const DashboardCards = ({ title, value }) => {
  return (
    <div>
      
    <div className="dashboard-card2">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
    </div>
  );
};

export default DashboardCards;
