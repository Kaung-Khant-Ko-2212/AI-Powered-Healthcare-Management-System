import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Removed useLocation since we’re using props now

const FoodList = ({ selectedItems, setSelectedItems, categoryId, categoryName }) => {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!categoryId) return;
      try {
        console.log("Fetching food items for categoryID:", categoryId);
        const response = await fetch(
          `http://localhost:8080/api/food-items/foodcategory?categoryId=${categoryId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFoodItems(data.map((item) => ({ ...item, quantity: 0 })));
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, [categoryId]);

  useEffect(() => {
    console.log("Received categoryName in FoodList:", categoryName); // Debug log to verify prop
  }, [categoryName]);

  const updateQuantity = (id, delta) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const handleSelect = () => {
    if (typeof setSelectedItems !== "function") {
      console.error("setSelectedItems is not a function!");
      return;
    }
    
    setSelectedItems((prevItems) => {
      const updatedItems = [...prevItems];

      foodItems.forEach((newItem) => {
        if (newItem.quantity > 0) {
          const existingIndex = updatedItems.findIndex((item) => item.id === newItem.id);
          if (existingIndex !== -1) {
            // Instead of adding, replace with the new quantity
            updatedItems[existingIndex] = { ...updatedItems[existingIndex], quantity: newItem.quantity };
          } else {
            updatedItems.push(newItem);
          }
        }
      });

      return updatedItems;
    });

    setTimeout(() => navigate("/food-categories"), 300);
};


  return (
    <div>
      <style>
        {`
          .food-list-container5 {
            padding: 10px; /* Reduced padding */
            text-align: center;
            max-width: 100%; /* Maximize width to fill right-section5 */
            margin: 0; /* Remove margin to use full available space */
            display: flex;
            flex-direction: column;
            width: 100%; /* Ensure full width within right-section5 to eliminate blank space */
            border: 1px solid #ccc; /* Frame for Food List section */
            border-radius: 5px; /* Rounded corners for the frame */
            overflow: hidden; /* Prevent any unexpected overflow from the container */
          }
          .header5 {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px; /* Reduced margin */
          }
          .header5 h2 {
            margin: 0 10px; /* Reduced margin */
          }
          .food-list5 {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px; /* Increased gap for larger items */
            flex-grow: 1; /* Expand to fill available space */
            max-height: 400px; /* Set a fixed height for scrolling; adjust as needed */
            overflow-y: auto; /* Enable only vertical scrolling for food items */
            overflow-x: hidden; /* Explicitly hide horizontal scrolling */
            width: 100%; /* Ensure full width for scrolling content */
          }
          .food-item5 {
            display: flex;
            align-items: center;
            gap: 10px; /* Increased gap for larger items */
            background-color: #f9f9f9;
            padding: 15px; /* Increased padding for larger items */
            border-radius: 8px; /* Slightly larger border radius for larger appearance */
            max-width: 100%; /* Maximize width to fill container */
            margin: 0 auto; /* Center the item within max-width */
            width: 100%; /* Ensure full width within max-width */
            height: 100px; /* Increased height for larger items */
            box-sizing: border-box; /* Ensure padding doesn’t push content beyond width */
          }
          .food-item5 span {
            flex: 1;
            text-align: left;
            font-size: 18px; /* Increased font size for text readability */
            white-space: nowrap; /* Prevent text wrapping that could cause horizontal overflow */
            overflow: hidden; /* Hide any overflow text */
            text-overflow: ellipsis; /* Add ellipsis for long text */
          }
          .quantity-controls5 {
            display: flex;
            align-items: center;
            gap: 8px; /* Increased gap for larger buttons */
          }
          .quantity-controls5 button {
            padding: 8px 12px; /* Increased padding for larger buttons */
            cursor: pointer;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            font-size: 16px; /* Increased font size for buttons */
          }
          .quantity-controls5 button:hover {
            background-color: #e0e0e0;
          }
          .button5 {
            padding: 10px 20px; /* Increased padding for larger buttons */
            margin: 0 5px; /* Reduced margin */
            cursor: pointer;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            font-size: 16px; /* Increased font size for buttons */
          }
          .button5:hover {
            background-color: rgb(85, 99, 104);
            color: #FFFFFF;
          }
          /* Style the scrollbar to match the history scrollbar and ensure it’s on the right side */
          .food-list5::-webkit-scrollbar {
            width: 8px; /* Width of the scrollbar */
            height: 8px; /* Ensure it’s visible on the right side */
          }
          .food-list5::-webkit-scrollbar-track {
            background: #f1f1f1; /* Track background */
            border-radius: 5px; /* Rounded corners for track */
          }
          .food-list5::-webkit-scrollbar-thumb {
            background: #888; /* Thumb color */
            border-radius: 5px; /* Rounded corners for thumb */
          }
          .food-list5::-webkit-scrollbar-thumb:hover {
            background: #555; /* Thumb color on hover */
          }
        `}
      </style>

      <div className="food-list-container5" style={{marginTop: '100px'}}>
        <div className="header5">

          <h2>{categoryName || "Unknown Category"}</h2> {/* Use prop or fallback */}
          <button className="button5" onClick={handleSelect}>
            Select
          </button>
        </div>
        <div className="food-list5">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div key={item.id} className="food-item5">
                <input
                  type="checkbox"
                  checked={item.quantity > 0}
                  onChange={() => updateQuantity(item.id, item.quantity > 0 ? -item.quantity : 1)}
                />
                <span>{item.name}</span> {/* Removed image_path text */}
                <span>{item.calories} kcal</span>
                <div className="quantity-controls5">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          ) : (
            <p>No food items available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodList;
