import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Specialties = ({ onSelectSpecialty }) => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/specialties/all')
      .then(response => {
        console.log("Specialties fetched:", response.data); // Debugging
        setSpecialties(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching specialties:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Divide specialties into two rows of 7 items each
  const row1 = specialties.slice(0, 7);
  const row2 = specialties.slice(7, 14);

  return (
    <div className="specialties-section">
      <div>
        {/* First Row */}
        <div className="d5row justify-content-center mb-4">
          {row1.map((specialty, index) => (
            <div key={index} className="d5col-lg-1 text-center" style={{ cursor: 'pointer' }}
            onClick={() => onSelectSpecialty(specialty.id)}>
              <div className="specialty-item p-3">
                <img
                  src={`/icons/${specialty.image}`}
                  alt={specialty.name}
                  className="img-fluid mb-2"
                  style={{ width: '50px', height: '50px', display: 'block', margin: 'auto' }}
                />
                <p className="small m-0">{specialty.name}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Second Row */}
        <div className="d5row justify-content-center">
          {row2.map((specialty, index) => (
            <div key={index} className="d5col-lg-1 text-center" style={{ cursor: 'pointer' }}
            onClick={() => onSelectSpecialty(specialty.id)}>
              <div className="specialty-item p-3">
                <img
                  src={`/icons/${specialty.image}`}
                  alt={specialty.name}
                  className="img-fluid mb-2"
                  style={{ width: '50px', height: '50px', display: 'block', margin: 'auto' }}
                />
                <p className="small m-0">{specialty.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Specialties;
