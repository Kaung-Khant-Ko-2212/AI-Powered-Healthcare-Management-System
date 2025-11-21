// components/StatsCard.js
import React from "react";
import "../styles/StatsCard.css";

const StatsCard = ({ icon, title, value }) => (
  <div className="stats-card3">
    <div className="icon3">{icon}</div>
      <h3>{title}</h3>
      <p>{value}</p>
  </div>
);

export default StatsCard;
