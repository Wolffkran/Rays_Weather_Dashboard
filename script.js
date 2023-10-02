const apiKey = '7b9670412b2e1de715ee39143ab6dbaa';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city !== '') {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    // Use the OpenWeatherMap API to fetch weather data
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // Display current weather data
            displayCurrentWeather(data);

            // Add city to search history
            addToSearchHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

    // Fetch 5-day forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // Display 5-day forecast
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayCurrentWeather(data) {
    // Extract relevant data from the API response and display it
    const cityName = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const weatherIcon = `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    currentWeather.innerHTML = `
        <h2>${cityName} (${date})</h2>
        <div>${weatherIcon}</div>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function addToSearchHistory(city) {
    const historyItem = document.createElement('button');
    historyItem.textContent = city;
    historyItem.addEventListener('click', function () {
        fetchWeatherData(city);
    });

    searchHistory.appendChild(historyItem);
}

function displayForecast(data) {
    // Extract and display the 5-day forecast data
    const forecastList = data.list;

    let forecastHTML = '<h2>5-Day Forecast</h2>';
    forecastList.slice(0, 5).forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const weatherIcon = `<img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}">`;
        const temperature = item.main.temp;
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;

        forecastHTML += `
            <div class="forecast-item">
                <p>${date}</p>
                <div>${weatherIcon}</div>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    });

    forecast.innerHTML = forecastHTML;
}
