import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import "../admins/ChartCard2.css";

// Register Chart.js components
Chart.register(...registerables);

const ChartGenderStats = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: ["Male", "Female"], // Labels for the chart
    maleUsers: [0], // Initial male user count
    femaleUsers: [0], // Initial female user count
  });

  // Fetch gender statistics from the backend
  useEffect(() => {
    const fetchUserGenderStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users/gender");
        const data = await response.json();

        // Update state with fetched data
        setChartData({
          labels: ["Male", "Female"],
          maleUsers: [data.maleCount || 0],
          femaleUsers: [data.femaleCount || 0],
        });
      } catch (error) {
        console.error("Error fetching user gender stats:", error);
      }
    };

    fetchUserGenderStats();
  }, []);

  // Render or update the chart when chartData changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the existing chart instance
    }

    const ctx = document.getElementById("myChart").getContext("2d");

    // Create a new Chart instance
    chartRef.current = new Chart(ctx, {
      type: "bar", // Use a bar chart for gender distribution
      data: {
        labels: chartData.labels, // X-axis labels
        datasets: [
          {
            label: "Male Users",
            data: [chartData.maleUsers[0], 0], // Male user data (female data set to 0)
            backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue fill
            borderColor: "#6956E5", // Blue border
            borderWidth: 0.3,
          },
          {
            label: "Female Users",
            data: [0, chartData.femaleUsers[0]], // Female user data (male data set to 0)
            backgroundColor: "rgba(255, 99, 132, 0.8)", // More prominent pink fill
            borderColor: "#FB896B", // Pink border
            borderWidth: 0.3, // Thicker border for emphasis
          },
        ],
      },
      options: {
        responsive: true, // Make the chart responsive
        plugins: {
          legend: {
            position: "top", // Position the legend at the top
          },
          title: {
            display: true,
            text: "User Gender Distribution", // Chart title
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true, // Start the X-axis at zero
          },
          y: {
            beginAtZero: true, // Start the Y-axis at zero
          },
        },
      },
    });

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="chart-card3">
      <div className="chart-title3">User Gender Distribution</div>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default ChartGenderStats;