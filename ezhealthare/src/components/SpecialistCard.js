import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const SpecialistCard = ({ doctor, specialtyName, userId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false); // Track image loading errors

  // Backend base URL (adjust if your backend runs on a different port or host)
  const BASE_URL = "http://localhost:8080";

  // Fetch favorite doctors when the component loads
  useEffect(() => {
    if (userId) {
      axios
        .get(`${BASE_URL}/api/favorites/all?userId=${userId}`)
        .then((response) => {
          const favoriteDoctors = response.data.map((fav) => fav.id); // Assuming the response returns an array of doctor IDs
          setIsFavorite(favoriteDoctors.includes(doctor.id));
        })
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [doctor.id, userId]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`${BASE_URL}/api/favorites/remove?doctorId=${doctor.id}&userId=${userId}`);
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(`${BASE_URL}/api/favorites/add?doctorId=${doctor.id}&userId=${userId}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Construct the full image URL (assuming doctor.image is "uuid_susu.jpg" or "uploads/doctors/uuid_susu.jpg")
  const imageUrl = doctor.image ? `${BASE_URL}/uploads/doctors/${doctor.image}` : null;

  return (
    <div className="specialist-card">
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={doctor.name}
          className="specialist-card-img"
          onError={handleImageError} // Fallback if image fails to load
        />
      ) : (
        <div className="specialist-card-placeholder">
          <p>No Image Available</p>
        </div>
      )}
      <div className="specialist-card-body">
        <div className="specialist-card-header">
          <h5 className="specialist-card-name">{doctor.name}</h5>
          <span
            className="specialist-card-heart"
            onClick={toggleFavorite}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              color: isFavorite ? "red" : "black", // Red when favorited
            }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </span>
        </div>
        <p className="specialist-card-specialty">{specialtyName}</p>
      </div>
    </div>
  );
};

SpecialistCard.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string, // Optional image filename or path
  }).isRequired,
  specialtyName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired, // Make sure to pass the userId correctly
};

export default SpecialistCard;