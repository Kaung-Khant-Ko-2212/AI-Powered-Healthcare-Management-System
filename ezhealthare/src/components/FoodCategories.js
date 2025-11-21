import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FoodList from "./FoodList"; // Adjust the import path as needed
import Usernavbar from "./Usernavbar";

const FoodCategories = ({ selectedItems, setSelectedItems }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caloriesHistory, setCaloriesHistory] = useState(() => {
    const savedHistory = localStorage.getItem("caloriesHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track selected category
  const [selectedCategoryName, setSelectedCategoryName] = useState(null); // Track selected category name

  useEffect(() => {
    console.log("FoodCategories mounted with props - selectedItems:", selectedItems);
    console.log("FoodCategories mounted with props - setSelectedItems:", setSelectedItems);
    if (typeof setSelectedItems !== "function") {
      console.error("setSelectedItems is not a function! Selections and resets won’t sync with parent.");
    }
  }, [selectedItems, setSelectedItems]);

  useEffect(() => {
    fetch("http://localhost:8080/api/foodcategories/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched categories:", data); // Debug log for API response
        setCategories(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Sync selectedCategoryName with selectedCategoryId when categories load or change
  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      const category = categories.find(
        (cat) => cat.id === selectedCategoryId || cat.category_id === selectedCategoryId
      );
      const name = category ? (category.name || category.category_name || "Unknown Category") : null;
      console.log("Syncing selectedCategoryName for ID:", selectedCategoryId, "Name:", name);
      setSelectedCategoryName(name);
    }
  }, [selectedCategoryId, categories]);

  const currentTotalCalories = selectedItems.reduce(
    (sum, item) => sum + item.calories * (item.quantity || 1),
    0
  );

  const calculateTotalCalories = () => {
    if (selectedItems.length === 0) {
      alert("No items selected!");
      return;
    }

    console.log("Calculating with selectedItems:", selectedItems);
    const updatedHistory = [...caloriesHistory, currentTotalCalories];
    setCaloriesHistory(updatedHistory);
    localStorage.setItem("caloriesHistory", JSON.stringify(updatedHistory));

    if (typeof setSelectedItems === "function") {
      setSelectedItems([]);
    } else {
      console.error("setSelectedItems is not a function! Cannot reset selections.");
    }
  };

  const resetHistory = () => {
    setCaloriesHistory([]);
    localStorage.removeItem("caloriesHistory");
    if (typeof setSelectedItems === "function") {
      setSelectedItems([]);
    } else {
      console.error("setSelectedItems is not a function!");
    }
  };

  const handleCategoryClick = (categoryId, categoryName) => {
    console.log(`Clicked category: ${categoryName} (ID: ${categoryId})`); // Debug log
    console.log("Setting selectedCategoryId:", categoryId, "and initial selectedCategoryName:", categoryName); // Additional debug
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName); // Set the category name when clicked
  };

  // Fallback to find categoryName if selectedCategoryName is missing
  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.id === id || cat.category_id === id); // Try both 'id' and 'category_id'
    console.log("Finding category name for ID:", id, "Result:", category);
    return category ? (category.name || category.category_name || "Unknown Category") : "Unknown Category";
  };

  if (loading) return <p>Loading food categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <style>
        {`
          .container5 {
            display: flex;
            padding: 10px;
            max-width: 2000px; /* Increased max-width to allow more space for Food List */
            margin: 0 auto;
            gap: 20px;
          }
          .left-section5 {
            flex: 1; /* Set to 1 to match right side width */
            display: flex;
            flex-direction: column;
            gap: 20px;
            min-width: 0;
            padding: 10px;
            //border: 1px solid #ccc; /* Frame for left section */
            border-radius: 5px; /* Rounded corners for the frame */
          }
          .center-section5 {
            flex: 1; /* Reduced to allow more balanced space */
            text-align: center;
            max-width: none;
            padding: 10px;
            justify-content: flex-start; /* Keep content aligned left, but shift right with margin */
            margin-left: 80px; /* Move content 80px to the right */
            border: 1px solid #ccc; /* Frame for Choose Your Food section */
            border-radius: 5px; /* Rounded corners for the frame */
          }
          .right-section5 {
            flex: 1; /* Changed from 2 to 1 to match left side width */
            min-width: 0;
            padding: 20px; /* Keep padding for symmetry with left side */
            //border: 1px solid #ccc; /* Frame for Food List section */
            border-radius: 5px; /* Rounded corners for the frame */
          }
          .categories5 {
            display: flex;
            flex-direction: column; /* Vertical layout */
            gap: 10px; /* Reduced gap to match narrower category boxes */
            margin-bottom: 10px;
            max-width: 600px; /* Keep narrower category boxes */
            margin: 0 auto; /* Center the categories list within the shifted area */
            padding: 20px; /* Add padding inside the categories to prevent touching the frame */
          }
          .category-item5 {
            padding: 10px; /* Keep padding for consistency */
            background-color: #f9f9f9; /* Match FoodList background for harmony */
            border-radius: 5px; /* Match FoodList border radius for consistency */
            cursor: pointer;
            text-align: center;
            font-size: 18px; /* Keep font size for readability in smaller width */
            height: 80px; /* Keep height unchanged */
            display: flex;
            align-items: center;
            justify-content: center; /* Center text vertically and horizontally */
            width: 100%; /* Ensure full width within max-width */
            max-width: 600px; /* Keep reduced width for category boxes */
          }
          .category-item5:hover {
            background-color: rgb(85, 99, 104);
            color: #FFFFFF; /* Text color on hover remains white for contrast */
          }
          .calories-section5 {
            text-align: center;
            margin-top: 10px;
          }
          .buttons-section5 {
            text-align: center;
            margin-top: 10px;
            display: flex;
            justify-content: flex-start; /* Keep buttons aligned left, but shift right with margin */
            gap: 10px;
            margin-left: 80px; /* Move buttons 80px to the right to match categories */
          }
          .history5, .current-selection5 {
            display: flex;
            flex-direction: column;
            justify-content: flex-start; /* Align content at the top */
            align-items: center; /* Center content horizontally */
            height: 100%; /* Ensure the section takes full height for vertical centering */
            border: 1px solid #ccc; /* Frame for Current Selection and Calories History sections */
            border-radius: 5px; /* Rounded corners for the frame */
            padding: 10px; /* Ensure padding inside the frame */
            width: 100%; /* Ensure both sections have the same width */
          }
          .history5, .current-selection5 {
            overflow-y: auto; /* Enable vertical scrolling for both sections */
            max-height: 350px; /* Set a fixed height for scrolling; adjust as needed */
          }
          .history5 ul, .current-selection5 ul {
            list-style-type: none;
            padding: 0;
            text-align: center; /* Center the text/lists horizontally */
            width: 100%; /* Ensure full width for scrolling content */
          }
          .history5 li, .current-selection5 li {
            margin-bottom: 5px;
          }
          /* Style the scrollbar to match your screenshot and ensure it’s on the right side */
          .history5::-webkit-scrollbar, .current-selection5::-webkit-scrollbar {
            width: 8px; /* Width of the scrollbar */
            height: 8px; /* Ensure it’s visible on the right side */
          }
          .history5::-webkit-scrollbar-track, .current-selection5::-webkit-scrollbar-track {
            background: #f1f1f1; /* Track background */
            border-radius: 5px; /* Rounded corners for track */
          }
          .history5::-webkit-scrollbar-thumb, .current-selection5::-webkit-scrollbar-thumb {
            background: #888; /* Thumb color */
            border-radius: 5px; /* Rounded corners for thumb */
          }
          .history5::-webkit-scrollbar-thumb:hover, .current-selection5::-webkit-scrollbar-thumb:hover {
            background: #555; /* Thumb color on hover */
          }
          .button5 {
            padding: 8px 16px;
            cursor: pointer;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
          }
          .button5:hover {
            background-color: rgb(85, 99, 104);
            color: #FFFFFF;
          }
        `}
      </style>
      <Usernavbar />

      <div className="container5" style={{marginTop:"100px"}}>
        <div className="left-section5">
          <div className="current-selection5">
            <h3>Current Selection</h3>
            <ul>
              {selectedItems.length === 0 ? (
                <li>No items selected yet.</li>
              ) : (
                selectedItems.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity || 1})
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="history5">
            <h3>Calories Calculation History</h3>
            <ul>
              {caloriesHistory.length === 0 ? (
                <li>No history yet.</li>
              ) : (
                caloriesHistory.map((calories, index) => (
                  <li key={index}>
                    Attempt {index + 1}: {calories} kcal
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="center-section5">
          <h2>Choose Your Food</h2>
          <p>Select the food items you ate from the list below!</p>
          <div className="calories-section5">
            <h3>Current Selected Calories: {currentTotalCalories} kcal</h3>
          </div>
          <div className="buttons-section5">
            <button className="button5" onClick={calculateTotalCalories}>
              Calculate Total Calories
            </button>
            <button className="button5" onClick={resetHistory}>
              Reset History
            </button>
          </div>

          <div className="categories5">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item5`}
                onClick={() => handleCategoryClick(category.id, category.name || category.category_name || "Unknown")} // Fallback for name
              >
                {category.name || category.category_name || "Unknown"}
              </div>
            ))}
          </div>
        </div>

        <div className="right-section5">
          {selectedCategoryId ? (
            <FoodList
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              categoryId={selectedCategoryId}
              categoryName={selectedCategoryName || getCategoryNameById(selectedCategoryId)} // Use fallback if needed
            />
          ) : (
            <p>Select a category to see food items.</p>
          )}
        </div>
      </div>
  </div>
  );
};

export default FoodCategories;