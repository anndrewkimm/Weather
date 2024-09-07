const apiKey = '9d3abecabc85b9074aa06a30e7f1dda6';  // Replace this with your actual API key

let map;

function initMap(lat, lng) {
  if (map) {
    map.remove();  // Remove the existing map if it exists
  }
  map = L.map('map').setView([lat, lng], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  L.marker([lat, lng]).addTo(map);
}

function kelvinToFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 9/5 + 32).toFixed(2);  // Convert Kelvin to Fahrenheit and round to 2 decimal places
}

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    document.getElementById('temp').innerText = 'Please enter a city name.';
    document.getElementById('weatherDetails').innerText = '';
    document.getElementById('weatherIcon').innerHTML = '';
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  document.getElementById('loading').style.display = 'block';

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found or API request failed.');
      }
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const lat = data.coord.lat;
      const lng = data.coord.lon;
      const description = data.weather[0].description;
      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      document.getElementById('temp').innerText = `Temperature in ${city}: ${temp}°F`;
      document.getElementById('weatherDetails').innerText = `Description: ${description}`;
      document.getElementById('weatherIcon').innerHTML = `<img src="${icon}" alt="Weather icon">`;

      initMap(lat, lng); // Initialize map with city coordinates
      document.getElementById('loading').style.display = 'none';  // Hide loading text

      // Save search history
      let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
      if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
      }
    })
    .catch(error => {
      document.getElementById('temp').innerText = 'Error fetching data. Please check the city name or try again later.';
      document.getElementById('weatherDetails').innerText = '';
      document.getElementById('weatherIcon').innerHTML = '';
      document.getElementById('loading').style.display = 'none';  // Hide loading text
      console.error('Error fetching data:', error);
    });
}

// Get current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      initMap(lat, lng);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const temp = data.main.temp;
          const city = data.name;
          const description = data.weather[0].description;
          const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

          document.getElementById('temp').innerText = `Temperature in ${city}: ${temp}°F`;
          document.getElementById('weatherDetails').innerText = `Description: ${description}`;
          document.getElementById('weatherIcon').innerHTML = `<img src="${icon}" alt="Weather icon">`;
        })
        .catch(error => {
          document.getElementById('temp').innerText = 'Error fetching data. Please try again later.';
          document.getElementById('weatherDetails').innerText = '';
          document.getElementById('weatherIcon').innerHTML = '';
          console.error('Error fetching data:', error);
        });
    }, () => {
      document.getElementById('temp').innerText = 'Unable to retrieve location.';
      document.getElementById('weatherDetails').innerText = '';
      document.getElementById('weatherIcon').innerHTML = '';
    });
  } else {
    document.getElementById('temp').innerText = 'Geolocation is not supported by this browser.';
    document.getElementById('weatherDetails').innerText = '';
    document.getElementById('weatherIcon').innerHTML = '';
  }
}

// Toggle dark mode
document.getElementById('darkModeSwitch').addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
