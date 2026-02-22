async function getRandomWeather(cardContainer, random_lat = Math.floor(Math.random() * 181) - 90, random_lon = Math.floor(Math.random() * 361) - 180) {
    try {
        // Hide weather info on all other cards
        const otherCardContainers = document.querySelectorAll('.card-container');
        otherCardContainers.forEach(container => {
            if (container !== cardContainer) {
                container.style.maxWidth = '300px';
                // Find and hide weather divs in other containers
                const existingWeather = container.querySelector('.weather-info');
                if (existingWeather) {
                    existingWeather.style.display = 'none';
                }
            }
        });

        const weatherApiResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${random_lat}&lon=${random_lon}&appid=${CONFIG.OPENWEATHER_API_KEY}`)

        if (!weatherApiResponse.ok) {
            throw new Error(`HTTP error! Status: ${weatherApiResponse.status}`);
        }
        
        // Get the data for use as json, in this case weather api already sends it as json
        const weatherData = await weatherApiResponse.json();
        console.log('Fetch Success!');
        console.log(weatherData);

        // display weather response

        // - expand the card to increase towards the right with animation
        cardContainer.style.maxWidth = '100%';
        cardContainer.style.width = '50%';
        // - display information of cordinates, weather.main, weather.description, maybe weather.icon, main.temp, main.feels_like, main.humidity
        
        // Check if weather div already exists in this container, or create a new one
        let card_weather = cardContainer.querySelector('.weather-info');
        if (!card_weather) {
            card_weather = document.createElement('div');
            card_weather.className = 'weather-info';
            cardContainer.appendChild(card_weather);
        }
        
        card_weather.style.display = 'block';
        card_weather.innerHTML = `
            <div class = 'location-temp'>Temperature: ${(weatherData.main.temp - 273.15).toFixed(1)}°C</div>
            <div class = 'location-temp-feels'>Feels Like: ${(weatherData.main.feels_like - 273.15).toFixed(1)}°C</div>
            <div class = 'location-weather'>Weather: ${weatherData.weather[0].main}</div>
            <div class = 'location-weather-description'>Description: ${weatherData.weather[0].description}</div>
            <div class = 'location-temp-max'>Max temperature: ${(weatherData.main.temp_max - 273.15).toFixed(1)}°C</div>
            <div class = 'location-temp-min'>Min temperature: ${(weatherData.main.temp_min - 273.15).toFixed(1)}°C</div>
            <div class = 'location-humidity'>Humidity: ${weatherData.main.humidity}%</div>
            `;
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

async function displayRickAndMortyCharacters(random_page = Math.floor(Math.random() * 43)) {
    try {
        const apiResponse = await fetch(`https://rickandmortyapi.com/api/character/?page=${random_page}`);
        
        const generateButton = document.getElementById('generate');
        generateButton.disabled = true;
        
        const loadingText = document.getElementById('loading');
        loadingText.style.display = 'block';
        
        // fetch doesn't throw an error for HTTP statuses like 404 or 500
        // We need to check the 'ok' property, which is true for statuses 200-299
        if (!apiResponse.ok) {
            throw new Error(`HTTP error! Status: ${apiResponse.status}`);
        }
        
        // Get the data for use as json
        const rickAndMortyData = await apiResponse.json();
        const cardGrid = document.querySelector('.card-grid');
        loadingText.style.display = 'none';
        cardGrid.innerHTML = '';

        rickAndMortyData.results.forEach(character => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            const card = document.createElement('div');
            card.className = 'character-card';

            card.innerHTML = `<img src='${character.image}' alt='Character Avatar'>
            <div class = 'character-name'>Name: ${character.name}</div>
            <div class = 'character-status'>Status: ${character.status}</div>
            <div class = 'character-species'>Species: ${character.species}</div>
            <div class = 'character-gender'>Gender: ${character.gender}</div>
            <div class = 'character-location'>Location: ${character.location.name}</div>
            `;
            
            card.onclick = () => getRandomWeather(cardContainer);
            cardGrid.appendChild(cardContainer);
            cardContainer.appendChild(card);
        });

        console.log('Fetch Success!');
        console.log(rickAndMortyData);

        generateButton.disabled = false;

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}