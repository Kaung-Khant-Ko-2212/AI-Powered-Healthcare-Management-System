import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab } from "@mui/material";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import "../styles/DoctorRequests.css";
import Sidebar from "./Sidebar";

const DoctorRequests = () => {
  const [tab, setTab] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [counts, setCounts] = useState({ requested: 0, approved: 0, pending: 0 });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch("http://localhost:8080/api/cancel-schedule/pending"),
        fetch("http://localhost:8080/api/cancel-schedule/approved"),
      ]);

      const pendingData = await pendingRes.json();
      const approvedData = await approvedRes.json();

      // Ensure the data is an array
      setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
      setApprovedRequests(Array.isArray(approvedData) ? approvedData : []);

      setCounts({
        requested: (Array.isArray(pendingData) ? pendingData.length : 0) + (Array.isArray(approvedData) ? approvedData.length : 0),
        approved: Array.isArray(approvedData) ? approvedData.length : 0,
        pending: Array.isArray(pendingData) ? pendingData.length : 0,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cancel-schedule/approve/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.text();
      alert(result);
      fetchRequests(); // Refresh list after approval
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <div>
      <Sidebar />
      <div className="doctor-requests3">
        {/* Navigation Bar */}
        <div className="navbar3">
          <div className="navbar-icons3">
            <img
              src="https://via.placeholder.com/30"
              alt="profile"
              className="profile-icon3"
            />
          </div>
        </div>

        <div className="second-part3">
          {/* Summary Cards */}
          <div className="summary-section3">
            <div className="summary-card3">
              <div className="icon-div3">
                <MoveToInboxIcon sx={{ fontSize: "3rem" }} />
              </div>
              <div className="summary-div3">
                <p>{counts.requested}</p>
                <span>Requested</span>
              </div>
            </div>
            <div className="summary-card3">
              <div className="icon-div3">
                <EventAvailableIcon sx={{ fontSize: "3rem" }} />
              </div>
              <div className="summary-div3">
                <p>{counts.approved}</p>
                <span>Approved</span>
              </div>
            </div>
            <div className="summary-card3">
              <div className="icon-div3">
                <PendingActionsIcon sx={{ fontSize: "3rem" }} />
              </div>
              <div className="summary-div3">
                <p>{counts.pending}</p>
                <span>Pending</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onChange={handleTabChange} className="tabs3">
            <Tab label="Approved" />
            <Tab label="Pending" />
          </Tabs>

          {/* Tables */}
          {tab === 0 && (
            <div className="table-section3">
              <table className="requests-table3">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Cancellation Date</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(approvedRequests) &&
                    approvedRequests.map((req, index) => (
                      <tr key={index}>
                        <td>{req.doctor?.name || "Unknown Doctor"}</td>
                        <td>{req.doctor?.specialty?.name || "N/A"}</td>
                        <td>{req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "N/A"}</td>
                        <td>{req.reason || "N/A"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 1 && (
            <div className="table-section3">
              <table className="requests-table3">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Cancellation Date</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(pendingRequests) &&
                    pendingRequests.map((req, index) => (
                      <tr key={index}>
                        <td>{req.doctor?.name || "Unknown Doctor"}</td>
                        <td>{req.doctor?.specialty?.name || "N/A"}</td>
                        <td>{req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "N/A"}</td>
                        <td>{req.reason || "N/A"}</td>
                        <td>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleApprove(req.id)}
                          >
                            Approve
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorRequests;