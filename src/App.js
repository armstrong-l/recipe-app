import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import RecipeExcerpt from "./components/RecipeExcerpt.js"

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
      const request = await fetch("/api/recipes");
      if (request.ok) {
        const result = await request.json();
        setRecipes(result);
      } else {
        console.log("Could not fetch the recipes!");
      } 
            
    } catch (e) {
        console.error("An error occurred during the request", e);
        console.log("An unexpected error occurred.  Please try again.")
    }
    };

    fetchAllRecipes();
}, []);



  return (
    <div className='recipe-app'>
      <Header />
      <div className="recipe-list">
        {recipes.map((recipe) => (      
          <RecipeExcerpt key={recipe.id} recipe={recipe}/>
        ))}
      </div>
    </div>
  );
}

export default App;
