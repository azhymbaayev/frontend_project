const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NmVhNTM1MmQ0YmRiYmNmNGMyOTAxMjA5NjIzZjkxMSIsIm5iZiI6MTczMTU5NTc2OS40MTYxNDA2LCJzdWIiOiI2NzM2MGNiYmIwNDI5N2Y3MGM2ODNiZjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.XaQ1H0uXUQV5w8DXRgyAuVPYA29nmzhLCwO0uIr6QWQ";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const headers = {
    Authorization: `Bearer ${API_KEY}`,
};
async function autocompleteSearch() {
    const query = document.getElementById("searchInput").value;

    if (query.length < 2) {
        closeSuggestions();
        return;
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/keyword?query=${query}&page=1`,
            {
                headers: headers,
            }
        );
        const data = await response.json();
        displaySuggestions(data.results);
    } catch (error) {
        console.error("Error fetching keyword suggestions:", error);
    }
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = "";

    if (suggestions.length === 0) {
        closeSuggestions();
        return;
    }

    suggestionsContainer.style.display = "block";

    suggestions.forEach((suggestion) => {
        const item = document.createElement("div");
        item.classList.add("suggestion-item");
        item.textContent = suggestion.name;
        item.onclick = () => selectSuggestion(suggestion.name);
        suggestionsContainer.appendChild(item);
    });
}

function selectSuggestion(name) {
    document.getElementById("searchInput").value = name;
    closeSuggestions();
}

function closeSuggestions() {
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = "";
    suggestionsContainer.style.display = "none";
}

document.addEventListener("click", (event) => {
    const searchBar = document.querySelector(".search-bar");
    if (!searchBar.contains(event.target)) {
        closeSuggestions();
    }
});

async function searchMovies() {
    const query = document.getElementById("searchInput").value;
    const sortOption = document.getElementById("sortOption").value; // Get selected sort option

    try {
        const response = await fetch(
            `${BASE_URL}?query=${query}&page=1&sort_by=${sortOption}`,
            {
                headers: headers,
            }
        );
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}



function displayMovies(movies) {
    const moviesContainer = document.getElementById("moviesContainer");
    moviesContainer.innerHTML = "";

    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date}</p>
      <button class="watchlist-button" onclick='toggleWatchlist(${JSON.stringify(
          movie
      )})'>
        ${
            isInWatchlist(movie.id)
                ? "Remove from Watchlist"
                : "Add to Watchlist"
        }
      </button>
    `;
        movieCard.onclick = () => openMovieModal(movie.id);
        moviesContainer.appendChild(movieCard);
    });
}

async function openMovieModal(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const movie = await response.json();

        const movieDetails = document.getElementById("movieDetails");
        movieDetails.innerHTML = `
            <h2>${movie.title || "No Title Available"}</h2>
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}" style="width: 100%; height: auto;">
            <p>${movie.overview || "No Overview Available"}</p>
            <p>Rating: ${movie.vote_average || "N/A"}</p>
            <p>Runtime: ${movie.runtime ? movie.runtime + " minutes" : "N/A"}</p>
        `;

        document.getElementById("movieModal").style.display = "flex";
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}


function closeModal() {
    document.getElementById("movieModal").style.display = "none";
}

function isInWatchlist(movieId) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    return watchlist.some((movie) => movie.id === movieId);
}

function toggleWatchlist(movie) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const isInList = isInWatchlist(movie.id);

    if (isInList) {
        const updatedWatchlist = watchlist.filter(
            (item) => item.id !== movie.id
        );
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
        alert(`${movie.title} removed from watchlist`);
    } else {
        watchlist.push(movie);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert(`${movie.title} added to watchlist`);
    }

    displayWatchlist();
}

function displayWatchlist() {
    const watchlistContainer = document.getElementById("watchlistContainer");
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlistContainer.innerHTML = "<h2>Watchlist</h2>";

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML +=
            "<p>No movies in the watchlist yet.</p>";
        return;
    }

    watchlist.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
      <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>Release Date: ${movie.release_date}</p>
      <button class="watchlist-button" onclick='toggleWatchlist(${JSON.stringify(
          movie
      )})'>
        ${
            isInWatchlist(movie.id)
                ? "Remove from Watchlist"
                : "Add to Watchlist"
        }
      </button>
    `;
        watchlistContainer.appendChild(movieCard);
    });
}

document.addEventListener("DOMContentLoaded", displayWatchlist);
