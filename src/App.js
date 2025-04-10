import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt.js"
import RecipeFull from "./components/RecipeFull.js"
import NewRecipeForm from "./components/NewRecipeForm.js";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, //conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false)

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

const handleNewRecipe = async (e, newRecipe) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/recipes",{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(newRecipe)
    });
      // or can use if (response.status === 200 ) {
      if (response.ok) {
        const data = await response.json();
       
       setRecipes([...recipes, data.recipe]);

       console.log("Recipe added successfully!");

       setShowNewRecipeForm(false);    

       setNewRecipe({
        title: "",
        ingredients: "",
        instructions: "",
        servings: 1,
        description: "",
        image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      });
 
    }

  } catch (e) {
    console.error("An error occurred during the request", e);
    console.log("An unexpected error occurred. Please try again.")

  }

}  

const handleSelectRecipe = (recipe) => {
  setSelectedRecipe(recipe);
};

const handleUnselectRecipe = () => {
  setSelectedRecipe(null);
};

const hideRecipeForm = () => {
  setShowNewRecipeForm(false);
};

const showRecipeForm = () => {
  setShowNewRecipeForm(true);
  setSelectedRecipe(null);
};

const onUpdateForm = (e) => {
  const { name, value } = e.target;
  setNewRecipe({ ...newRecipe, [name]: value });
};



return (
  <div className='recipe-app'>
    <Header showRecipeForm={showRecipeForm}/>
      {showNewRecipeForm && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe}/>}
      {selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe}/>}
      {!selectedRecipe && !showNewRecipeForm && (
      <div className="recipe-list">
        {recipes.map((recipe) => (      
          <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe}/>
        ))}
      </div>)}
    </div>
  );
}

export default App;
