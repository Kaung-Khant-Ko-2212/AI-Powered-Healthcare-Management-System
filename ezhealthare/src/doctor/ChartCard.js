import React, { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import "../styles/ChartCard.css";

Chart.register(...registerables);

// Add doctorId as a prop
const ChartCard = ({ doctorId }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    malePatients: [],
    femalePatients: [],
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Use the doctorId prop in the API call
        const response = await fetch(`http://localhost:8080/api/appointments/doctor/${doctorId}`);
        const data = await response.json();

        // Process data to count unique male and female patients per month
        const genderCountByMonth = {};
        const seenPatientsByMonth = {};

        data.forEach((appointment) => {
          const date = new Date(appointment.appointmentDate);
          const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
          const userId = appointment.user?.id;
          const gender = appointment.user?.gender?.toLowerCase();

          if (!genderCountByMonth[monthYear]) {
            genderCountByMonth[monthYear] = { male: 0, female: 0 };
            seenPatientsByMonth[monthYear] = new Set();
          }

          if (userId && !seenPatientsByMonth[monthYear].has(userId)) {
            seenPatientsByMonth[monthYear].add(userId);
            if (gender === "male") {
              genderCountByMonth[monthYear].male += 1;
            } else if (gender === "female") {
              genderCountByMonth[monthYear].female += 1;
            }
          }
        });

        // Sort months chronologically
        const sortedMonths = Object.keys(genderCountByMonth).sort((a, b) => {
          return new Date(`01 ${a}`) - new Date(`01 ${b}`);
        });

        const malePatients = sortedMonths.map((month) => genderCountByMonth[month].male);
        const femalePatients = sortedMonths.map((month) => genderCountByMonth[month].female);

        setChartData({
          labels: sortedMonths,
          malePatients,
          femalePatients,
        });
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };

    // Only fetch if doctorId is provided
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]); // Add doctorId as a dependency

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("myChart").getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Male Patients",
            data: chartData.malePatients,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "#6956E5",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "#6956E5",
            pointRadius: 4,
          },
          {
            label: "Female Patients",
            data: chartData.femalePatients,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "#FB896B",
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="chart-card3">
      <div className="chart-title3">Patient Gender Trends by Month</div>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default ChartCard;