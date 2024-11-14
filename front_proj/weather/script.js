const WEATHER_API_KEY = "7e14aad104d94b9bbd571753241010";
const WEATHER_BASE_URL = "https://api.weatherapi.com/v1/";
let isCelsius = true;

const cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "San Francisco", "Columbus", "Indianapolis", "Fort Worth", "Charlotte",
    "Seattle", "Denver", "El Paso", "Detroit", "Washington", "Boston",
    "Nashville", "Memphis", "Portland", "Oklahoma City", "Las Vegas",
    "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno",
    "Sacramento", "Kansas City", "Atlanta", "Miami", "Colorado Springs",
    "Almaty", "Astana", "Oral", "Moscow"
];

function getWeatherIcon(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("rain")) return "weatherImages/rain.png";
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) return "weatherImages/sun.png";
    if (conditionLower.includes("snow")) return "weatherImages/snow.png";
    if (conditionLower.includes("cloud")) return "weatherImages/cloudy.png";
    return "weatherImages/cloudy.png";
}

async function searchWeather() {
    const city = document.getElementById("searchInput").value;

    try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(
            `${WEATHER_BASE_URL}current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`
        );
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);

        // Fetch forecast data
        const forecastResponse = await fetch(
            `${WEATHER_BASE_URL}forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=5&aqi=no&alerts=no`
        );
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("There was an error fetching the weather data. Please check your API key or try again later.");
    }
}

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const response = await fetch(
                        `${WEATHER_BASE_URL}current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=no`
                    );
                    const data = await response.json();
                    const cityName = data.location.name;
                    document.getElementById("searchInput").value = cityName;
                    searchWeather();
                } catch (error) {
                    console.error("Error fetching city name:", error);
                    alert("Could not retrieve city name. Please try again.");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function autocompleteLocalSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = "";

    if (query.length < 2) {
        closeSuggestions();
        return;
    }

    const filteredCities = cities.filter(city => city.toLowerCase().startsWith(query));

    if (filteredCities.length === 0) {
        closeSuggestions();
        return;
    }

    suggestionsContainer.style.display = "block";
    filteredCities.forEach(city => {
        const item = document.createElement("div");
        item.classList.add("suggestion-item");
        item.textContent = city;
        item.onclick = () => {
            selectSuggestion(city);
            closeSuggestions();
        };
        suggestionsContainer.appendChild(item);
    });
}

function selectSuggestion(city) {
    document.getElementById("searchInput").value = city;
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

function displayCurrentWeather(data) {
    const container = document.getElementById("currentWeatherDisplay");
    const weatherCondition = data.current.condition.text;
    const customIcon = getWeatherIcon(weatherCondition);

    container.innerHTML = `
        <h3>${data.location.name}</h3>
        <img src="${customIcon}" width="100px" alt="${weatherCondition}">
        <p>Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)</p>
        <p>Feels Like: ${data.current.feelslike_c}°C (${data.current.feelslike_f}°F)</p>
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind Speed: ${data.current.wind_kph} kph</p>
        <p>Condition: ${weatherCondition}</p>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecastDisplay");
    forecastContainer.innerHTML = "<h3>3-Day Forecast</h3>";

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date).toLocaleDateString();
        const weatherCondition = day.day.condition.text;
        const customIcon = getWeatherIcon(weatherCondition);

        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <p>${date}</p>
                <img src="${customIcon}" width="100px" alt="${weatherCondition}">
                <p>High: ${day.day.maxtemp_c}°C (${day.day.maxtemp_f}°F)</p>
                <p>Low: ${day.day.mintemp_c}°C (${day.day.mintemp_f}°F)</p>
                <p>${weatherCondition}</p>
            </div>
        `;
    });
}

function toggleUnit() {
    isCelsius = !isCelsius;
    searchWeather();
}

document.getElementById("searchInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchWeather();
    }
});
