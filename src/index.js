//function to replace values on html page
function htmlReplace(id, yourReplacement) {
  let cityReplacement = document.querySelector(`#${id}`);
  cityReplacement.innerHTML = `${yourReplacement}`;
}

function apiCallForCitySearching(city) {
  let apiKey = "b7c86efaac7c13373o4d08b12f9t3f33";
  let shecodesurl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  //console.log(url);
  axios.get(shecodesurl).then(getApiData);
}
function getApiData(response) {
  //it gives the forcastapicall the name of the city searched by user
  forecastApiCall(response.data.city);
  let data = response.data;
  weatherIcon(data);
  CityTemp(data);
  CityName(data);
  CityHumidity(data);
  CityWind(data);
  CityDescription(data);
  getDate(data);
}
//function to get temperature value from API
function CityTemp(data) {
  let temp = Math.round(data.temperature.current);
  htmlReplace("temperature-value", temp);
}
///function to get city name from the API
function CityName(data) {
  let cityName = data.city.toUpperCase();
  htmlReplace("currentCity", cityName);
}
//function to get humidity value from API
function CityHumidity(data) {
  let cityHumidity = data.temperature.humidity;
  htmlReplace("humidity-value", cityHumidity);
}
// function to get windspeed from API
function CityWind(data) {
  let cityWind = Math.round(data.wind.speed);
  htmlReplace("wind-value", cityWind);
}
//function to get weather discription from API
function CityDescription(data) {
  let CityDescription = data.condition.description;
  htmlReplace("description", CityDescription);
}
function weatherIcon(data) {
  let weatherIcon = data.condition.icon_url;
  let weatherIconChange = document.querySelector("#weather-icon");
  weatherIconChange.src = `${weatherIcon}`;
}
//Function to call for a default city.
function defaultCity(defaultCity) {
  apiCallForCitySearching(defaultCity);
}
// function to get the city searched by user and get the weather from the API
function getFormInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  let cityInput = city.value;
  cityInput = cityInput.toUpperCase().replace(".", " ").trim();
  apiCallForCitySearching(cityInput);
  //console.log(cityInput);
}
// For form submission
let form = document.querySelector("form");
form.addEventListener("submit", getFormInput);

//Function for last updated time
function getDate(data) {
  let daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let timeStamp = data.time;
  let date = new Date(timeStamp * 1000);
  let day = daysOfTheWeek[date.getDay()];
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let lastUpdated = `Updated ${day} ${hours}:${minutes}`;
  htmlReplace("day-and-time", lastUpdated);
}

function farenheitUnit(event) {
  event.preventDefault();
  let currentValue = document.querySelector("#temperature-value");
  currentValue = Math.round(currentValue.innerHTML * 1.8 + 32);
  htmlReplace("temperature-value", currentValue);
  addClassList("farenheit-unit");
  removeClassList("celsius-unit");
}

function celsiusUnit(event) {
  event.preventDefault();
  let farenhietValue = document.querySelector("#temperature-value");
  farenhietValue = farenhietValue.innerHTML;
  let celsiusValue = Math.round(((farenhietValue - 32) * 5) / 9);
  htmlReplace("temperature-value", celsiusValue);
  addClassList("celsius-unit");
  removeClassList("farenheit-unit");
}
function addClassList(elementId) {
  let link = document.querySelector(`#${elementId}`);
  link.classList.add("unclickable-link");
}
function removeClassList(elementId) {
  let link = document.querySelector(`#${elementId}`);
  link.classList.remove("unclickable-link");
}

// function to search for the current location of user on the api
function apiCallForCurrentLocation(lat, long) {
  let apiKey = "b7c86efaac7c13373o4d08b12f9t3f33";
  let url = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(url).then(getCoordApiData); //api calls the function to recieve data
}
//for current location from user location
function currentLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  apiCallForCurrentLocation(lat, long);
}
//function to get current location of user
function getUserGeoLocation(event) {
  //event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}

function weatherForcastSorting(response) {
  let dailyForcast = response.data.daily;
  let sentence = "";
  let forcastDetails = {};
  dailyForcast.forEach(function (daysForcast, index) {
    if (index < 6) {
      let day = forcastDay(daysForcast.time);
      let forcastIcon = daysForcast.condition.icon_url;
      let maxTemp = Math.round(daysForcast.temperature.maximum);
      let minTemp = Math.round(daysForcast.temperature.minimum);
      let humidity = daysForcast.temperature.humidity;
      let wind = daysForcast.wind.speed;
      let description = daysForcast.condition.description;
      forcastDetails[index] = {
        indexex: index,
        days: day,
        icon: forcastIcon,
        max: maxTemp,
        min: minTemp,
        humi: humidity,
        win: wind,
        descriptin: description,
      };

      sentence += `<div class="shadow col-2 day day${index}">
            <h6>${day}</h6>
            <strong
              ><img
                src=${forcastIcon}
                alt=""
            /></strong>
            <p id= "min-max"><span>${maxTemp}°</span><span id="min"> ${minTemp}°</span></p>
          </div>`;
    }
  });
  let forcastSection = document.querySelector("#forcast-section");
  forcastSection.innerHTML = sentence;
}
function forecastApiCall(data) {
  let query = data;
  let key = "b7c86efaac7c13373o4d08b12f9t3f33";
  let url = `https://api.shecodes.io/weather/v1/forecast?query=${query}&key=${key}&units=metric`;
  //console.log(url);
  axios.get(url).then(weatherForcastSorting);
}
function forcastDay(timestamp) {
  let daysOfForcast = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let date = new Date(timestamp * 1000);
  let forcastDay = daysOfForcast[date.getDay()];
  return forcastDay;
}
function getCoordApiData(response) {
  //it gives the forcastapicall the name of the city searched by user
  let data = response.data;
  weatherIcon(data);
  CityTemp(data);
  CityName(data);
  CityHumidity(data);
  CityWind(data);
  CityDescription(data);
  getDate(data);
}

let currentLocationIcon = document.querySelector(".location-icon");
currentLocationIcon.addEventListener("click", getUserGeoLocation);

let farenheit = document.querySelector("#farenheit-unit");
farenheit.addEventListener("click", farenheitUnit);

let celsius = document.querySelector("#celsius-unit");
celsius.addEventListener("click", celsiusUnit);

defaultCity("paris");
