import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaRegCalendarCheck, FaCalendarTimes, FaRegClock } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from "./Sidebar";

const ConfirmAppointment = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [statusCounts, setStatusCounts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatusCounts();
    fetchAppointments(selectedTab.toUpperCase());
  }, [selectedTab]);

  const fetchStatusCounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/appointments/status-counts');
      setStatusCounts(response.data);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const fetchAppointments = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/appointments/by-status/${status}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      // Refresh data
      fetchStatusCounts();
      fetchAppointments(selectedTab.toUpperCase());
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CANCELLED':
        return <FaCalendarTimes className="text-danger" />;
      case 'CONFIRMED':
        return <FaRegCalendarCheck className="text-primary" />;
      case 'PENDING':
        return <FaRegClock className="text-info" />;
      default:
        return null;
    }
  };

  const renderAppointmentCard = (appointment) => {
    if (!appointment || !appointment.user || !appointment.doctor) {
      return null;
    }

    return (
      <Col key={appointment.id}>
        <Card className="shadow-sm p-3 border" style={{ width: "100%", maxWidth: "400px", backgroundColor: "#F8F8F8" }}>
          <Card.Body style={{ textAlign: "left", lineHeight: "10px", backgroundColor: "#F8F8F8" }}>
            <div className="d-flex align-items-center mb-2">
              <FaUserCircle size={24} className="me-2" />
              <strong style={{ color: "#827979" }}>Patient name:</strong>
            </div>
            <p style={{ paddingLeft: "33px" }}>
              <span className="fw-bold">{appointment.user.fullName || 'N/A'}</span>
            </p>
            
            <p style={{ paddingLeft: "33px", color: "#827979" }}>
              <strong>Email:</strong>
            </p>
            <p style={{ paddingLeft: "33px" }}>
              <span className="fw-bold">{appointment.user.email || 'N/A'}</span>
            </p>
            <hr />
            <p style={{ paddingLeft: "33px", color: "#827979" }}>
              <strong>Doctor Name:</strong>
            </p>
            <p style={{ paddingLeft: "33px" }}>
              <span className="fw-bold">{appointment.doctor.name || 'N/A'}</span>
            </p>
            <p style={{ paddingLeft: "33px", color: "#827979" }}>
              <strong>Schedule:</strong>
            </p>
            <p style={{ paddingLeft: "33px" }}>
              <span className="fw-bold">
                {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.appointmentTime}
              </span>
            </p>
            <div className="d-flex justify-content-between flex-wrap">
              {selectedTab === 'pending' && (
                <>
                  <Button
                    variant="outline-danger"
                    className="mb-2"
                    style={{ width: "120px" }}
                    onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="mb-2"
                    style={{ width: "120px", backgroundColor: "#5F94CD" }}
                    onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
                  >
                    Confirm
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div style={{ display: "flex", overflowX: "hidden", backgroundColor: "white" }}>
      <Sidebar />
      <Container
        className="mt-4"
        style={{
          marginLeft: "260px",
          padding: "20px",
          width: "calc(100% - 260px)",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        {/* Status Cards */}
        <div className="flex justify-center mt-0 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {statusCounts.map((status, index) => (
              <div key={index} style={{ backgroundColor: "#F8F8F8" }} className="border rounded-2xl shadow-md p-0 flex flex-col items-center w-full">
                <div style={{ display: "flex", marginTop: "20px" }}>
                  <div className="bg-blue-100 p-3 rounded-full mb-2" style={{ height: "50px", marginRight: "30px" }}>
                    {getStatusIcon(status.status)}
                  </div>
                  <div>
                    <h5 className="text-xl font-semibold">{status.count}</h5>
                    <p className="text-gray-600">{status.status.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-3">
          <div className="d-flex flex-wrap">
            {["Pending", "Confirmed", "Cancelled"].map((tab) => (
              <Button
                key={tab}
                variant={selectedTab === tab.toLowerCase() ? "primary" : "light"}
                style={selectedTab === tab.toLowerCase() ? { backgroundColor: "#5F94CD", borderColor: "#5F94CD" } : {}}
                className="me-2 mb-2"
                onClick={() => setSelectedTab(tab.toLowerCase())}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>

        {/* Appointments Grid */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Row className="row-cols-1 row-cols-md-3 g-3">
            {appointments.map((appointment) => renderAppointmentCard(appointment))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ConfirmAppointment;
