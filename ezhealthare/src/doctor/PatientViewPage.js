// src/App.js
import React from 'react';
import Navbar from './Navbar';
import PatientTable from './PatientTable';

const PatientViewPage= () => {
  return (
    <div>
      <Navbar />
      <PatientTable />
    </div>
  );
};

export default PatientViewPage;
