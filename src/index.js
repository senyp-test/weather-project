let apiKey = "50c2acd53349fabd54f52b93c8650d37";
//For date and time
let currentDateAndTime = new Date();
let daysOfTheWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = daysOfTheWeek[currentDateAndTime.getDay()];
let currentHour = currentDateAndTime.getHours();
let currentMinutes = currentDateAndTime
  .getMinutes()
  .toString()
  .padStart(2, "0");
let displayedDayAndTime = `${currentDay},   ${currentHour}:${currentMinutes}`;
let dateChange = document.querySelector("#day-and-time");
dateChange.innerHTML = displayedDayAndTime;
// end
// FOR city search
function htmlReplace(id, yourReplacement) {
  let cityReplacement = document.querySelector(`#${id}`);
  cityReplacement.innerHTML = `${yourReplacement}`;
}

function farenhietTemperature() {
  let farenhietValue = 66;
  htmlReplace("temperature", farenhietValue);
}
function celsiusTemperature() {
  let celsiusValue = 24;
  htmlReplace("temperature", celsiusValue);
}

function getFormInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  let cityInput = city.value;
  cityInput = cityInput.toUpperCase().replace(".", " ").trim();
  apiCallForCitySearching(cityInput);
  //console.log(cityInput);
}
// function that recieve response from api
function getApiData(response) {
  //console.log(response);
  let data = response.data;
  weatherIcon(data);
  CityTemp(data);
  CityName(data);
  CityHumidity(data);
  CityWind(data);
  CityDescription(data);
}
function CityTemp(data) {
  let temp = Math.round(data.main.temp);
  htmlReplace("temperature", temp);
  //console.log(temp);
}
function CityName(data) {
  let cityName = data.name.toUpperCase();
  htmlReplace("currentCity", cityName);
}
function CityHumidity(data) {
  let cityHumidity = data.main.humidity;
  htmlReplace("humidity-value", cityHumidity);
}
function CityWind(data) {
  let cityWind = Math.round(data.wind.speed);
  htmlReplace("wind-value", cityWind);
}
function CityDescription(data) {
  let CityDescription = data.weather[0].description;
  htmlReplace("description", CityDescription);
}

function apiCallForCitySearching(city) {
  let apiKey = "50c2acd53349fabd54f52b93c8650d37";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  //console.log(url);
  axios.get(url).then(getApiData);
}
//for current location
function currentLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  // calls the function that can handle api request for the long and lat variable
  apiCallForCurrentLocation(lat, long);
}
// function to search for the current location of user on the api
function apiCallForCurrentLocation(lat, long) {
  let apiKey = "50c2acd53349fabd54f52b93c8650d37";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(url).then(getApiData); //api calls the function to recieve data
}
//function to get current location of user
function getUserGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}
// for form submission
let form = document.querySelector("form");
form.addEventListener("submit", getFormInput);

//for button clicking
let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", getUserGeoLocation);
function weatherIcon(data) {
  let weatherIcon = data.weather[0].icon;
  let weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  let weatherIconChange = document.querySelector("#weather-icon");
  weatherIconChange.src = `${weatherIconUrl}`;
}
