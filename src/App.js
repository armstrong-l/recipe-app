import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RecipeExcerpt from "./components/RecipeExcerpt.js"
import RecipeFull from "./components/RecipeFull.js"
import NewRecipeForm from "./components/NewRecipeForm.js";
import { displayToast } from "./helpers/toastHelper.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
      const request = await fetch("/api/recipes");
      if (request.ok) {
        const result = await request.json();
        setRecipes(result);
      } else {
        displayToast("Could not fetch the recipes!", "error");
      } 
            
      } catch {
        displayToast("An unexpected error occurred.  Please try again.", "error");
      }
    };

    fetchAllRecipes();
}, []);


// Function to handle adding new recipe to database
const handleNewRecipe = async (e, newRecipe) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/recipes", {
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

       displayToast("Recipe added successfully!", "success");

       setShowNewRecipeForm(false);    

       setNewRecipe({
        title: "",
        ingredients: "",
        instructions: "",
        servings: 1,
        description: "",
        image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      });
 
    } else {
      displayToast("Oops - could not add recipe!", "error");
    }

  } catch {
    displayToast("An unexpected error occurred. Please try again.", "error");
  }
}  


// Function to handle updating recipe from database
const handleUpdateRecipe = async (e, selectedRecipe) => {
  e.preventDefault();
  const { id } = selectedRecipe;

  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(selectedRecipe)
    });
      // or can use if (response.status === 200 ) {
      if (response.ok) {
        const data = await response.json();
       
        setRecipes(  
          recipes.map((recipe) => {
            if (recipe.id === id) {
              // Return the saved data from the db
              return data.recipe;
            } else {
              return recipe;
            }
          })
        );

        displayToast("Recipe updated successfully!", "success");

      } else {
      displayToast("Oops - could not update recipe!", "error");
    }

  } catch {
    displayToast("An unexpected error occurred. Please try again.", "error");
  }

  setSelectedRecipe(null);   
};  


// Function to handle deleting recipe from database
const handleDeleteRecipe = async (recipeId) => {
    
  try {
    const response = await fetch(`/api/recipes/${recipeId}`, {
      method: "DELETE",
    });
      // or can use if (response.status === 200 ) {
      if (response.ok) {    
        setRecipes(  
          recipes.filter((recipe) => {return recipe.id !== recipeId}));
        
        setSelectedRecipe(null);
       
        displayToast("Recipe deleted successfully!", "success");

      } else {
        displayToast("Oops - could not delete recipe!", "error");
      }

  } catch {
    displayToast("An unexpected error occurred. Please try again.", "error");
  }

  setSelectedRecipe(null);   
};  

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

const onUpdateForm = (e, action ="new") => {
  const { name, value } = e.target;
  if (action==="update") {
    setSelectedRecipe({ ...selectedRecipe, [name]: value });
  } else if (action==="new"){
    setNewRecipe({ ...newRecipe, [name]: value });
}};


const updateSearchTerm = (text) => {
  setSearchTerm(text);
};

const handleSearch = () => {
  const searchResults = recipes.filter((recipe) => {
    const valuesToSearch = [recipe.title, recipe.ingredients, recipe.description]
    return valuesToSearch.some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    });

  return searchResults;
};

const displayedRecipes = (searchTerm) ? handleSearch() : recipes;

const displayAllRecipes = () => {
  hideRecipeForm();
  handleUnselectRecipe();
  updateSearchTerm("");
};
 

return (
  <div className='recipe-app'>
    <Header 
    showRecipeForm={showRecipeForm} 
      searchTerm={searchTerm}
      updateSearchTerm={updateSearchTerm}
      displayAllRecipes={displayAllRecipes}
    />
    {showNewRecipeForm && 
      <NewRecipeForm 
        newRecipe={newRecipe} 
        hideRecipeForm={hideRecipeForm} 
        onUpdateForm={onUpdateForm} 
        handleNewRecipe={handleNewRecipe}
        />}
    {selectedRecipe && 
      <RecipeFull 
        selectedRecipe={selectedRecipe} 
        handleUnselectRecipe={handleUnselectRecipe}
        onUpdateForm={onUpdateForm}
        handleUpdateRecipe={handleUpdateRecipe}
        handleDeleteRecipe={handleDeleteRecipe}
        />}
    {!selectedRecipe && !showNewRecipeForm && (
      <div className="recipe-list">
        {displayedRecipes.map((recipe) => (      
          <RecipeExcerpt 
            key={recipe.id} 
            recipe={recipe} 
            handleSelectRecipe={handleSelectRecipe}
            />
        ))}
      </div>)}
      <ToastContainer />
    </div>
  );
}

export default App;
