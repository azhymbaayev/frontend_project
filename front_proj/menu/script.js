const API_KEY = 'f608a681ab8046c19f8c7e8977f65bfd';
const BASE_URL = 'https://api.spoonacular.com/recipes';

async function autocompleteSearch() {
    const query = document.getElementById('searchInput').value;
    if (query.length < 2) {
      closeSuggestions();
      return;
    }
    
    try {
      const response = await fetch(`${BASE_URL}/autocomplete?query=${query}&number=10&apiKey=${API_KEY}`);
      const suggestions = await response.json();
      displaySuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    }
}

function displaySuggestions(suggestions) {
  const suggestionsContainer = document.getElementById('suggestions');
  suggestionsContainer.innerHTML = '';
  
  if (suggestions.length === 0) {
    closeSuggestions();
    return;
  }
  
  suggestionsContainer.style.display = 'block';
  
  suggestions.forEach(suggestion => {
    const item = document.createElement('div');
    item.classList.add('suggestion-item');
    item.textContent = suggestion.title;
    item.onclick = () => selectSuggestion(suggestion.title);
    suggestionsContainer.appendChild(item);
  });
}

function selectSuggestion(title) {
  document.getElementById('searchInput').value = title;
  closeSuggestions();
}

function closeSuggestions() {
  const suggestionsContainer = document.getElementById('suggestions');
  suggestionsContainer.innerHTML = '';
  suggestionsContainer.style.display = 'none';
}

document.addEventListener('click', (event) => {
  const searchBar = document.querySelector('.search-bar');
  if (!searchBar.contains(event.target)) {
    closeSuggestions();
  }
});

  
async function searchRecipes() {
    const query = document.getElementById('searchInput').value;
    try {
      const response = await fetch(`${BASE_URL}/complexSearch?query=${query}&number=9&apiKey=${API_KEY}`);
      const data = await response.json();
      console.log('data here: ', data);
      displayRecipes(data.results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }
  

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = '';
  
    recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p>Ready in ${recipe.readyInMinutes} minutes</p>
        <p>Servings: ${recipe.servings}</p>
        <button class="favorite-button" onclick='toggleFavorite(${JSON.stringify(recipe)})'>
          ${isFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      `;
  
      recipeCard.onclick = () => openRecipeModal(recipe.id);
      recipesContainer.appendChild(recipeCard);
    });
  }
  

async function openRecipeModal(recipeId) {
  try {
    const response = await fetch(`${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`);
    const recipe = await response.json();

    const recipeDetails = document.getElementById('recipeDetails');
    recipeDetails.innerHTML = `
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; height: auto;">
      <h3>Ingredients:</h3>
      <ul>
        ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
      </ul>
      <h3>Instructions:</h3>
      <p>${recipe.instructions || 'No instructions available.'}</p>
      <h3>Nutrition:</h3>
      <p>Calories: ${recipe.nutrition?.nutrients.find(n => n.name === "Calories")?.amount || "N/A"} kcal</p>
    `;

    document.getElementById('recipeModal').style.display = 'flex';
  } catch (error) {
    console.error('Error fetching recipe details:', error);
  }
}

function closeModal() {
  document.getElementById('recipeModal').style.display = 'none';
}

document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchRecipes();
  }
});


function isFavorite(recipeId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(recipe => recipe.id === recipeId);
  }
  
  
function toggleFavorite(recipe) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const isFav = isFavorite(recipe.id);
    
    if (isFav) {
      const updatedFavorites = favorites.filter(fav => fav.id !== recipe.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert(`${recipe.title} removed from favorites`);
    } else {
      favorites.push(recipe);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${recipe.title} added to favorites`);
    }
  
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
      if (button.dataset.recipeId === recipe.id.toString()) {
        button.textContent = isFav ? 'Add to Favorites' : 'Added';
        button.style.backgroundColor = isFav ? '#ff6347' : '#4CAF50'; 
      }
    });
  
    displayFavorites();
  }
  
  function displayFavorites() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesContainer.innerHTML = '<h2>Favorites</h2>';
  
    if (favorites.length === 0) {
      favoritesContainer.innerHTML += '<p>No favorite recipes yet.</p>';
      return;
    }
  
    favorites.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p>Ready in ${recipe.readyInMinutes} minutes</p>
        <p>Servings: ${recipe.servings}</p>
        <button class="favorite-button" onclick='toggleFavorite(${JSON.stringify(recipe)})'>
          ${isFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      `;
      favoritesContainer.appendChild(recipeCard);
    });
  }
  
  
  function displayRecipesWithFavorites(recipes) {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = '';
  
    recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      recipeCard.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p>Ready in ${recipe.readyInMinutes} minutes</p>
        <p>Servings: ${recipe.servings}</p>
        <button class="favorite-button" onclick='toggleFavorite(${JSON.stringify(recipe)})'>
          ${isFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      `;
      recipeCard.onclick = () => openRecipeModal(recipe.id);
      recipesContainer.appendChild(recipeCard);
    });
  }
  
  
  document.addEventListener('DOMContentLoaded', displayFavorites);
  