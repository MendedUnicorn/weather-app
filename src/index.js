import "./style.css";
import "./css/open-weather-icons.css";
import { capitalizeAllWords } from "./utility";
const moment = require("moment");

const API_KEY = process.env.API_KEY;

async function getCoordinates(city) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${API_KEY}`,
      {
        mode: "cors",
      }
    );
    const data = await response.json();
    console.log("city", data);
    if (data.length === 0) {
      throw "couldnt find city";
    }
    //console.log("got data: ", data);
    return { lat: data[0].lat, long: data[0].lon, city: data[0].name };
  } catch (err) {
    console.log("Error:", err);
  }
}

async function getWeatherData(city) {
  try {
    const coordinates = await getCoordinates(city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.long}&units=metric&appid=${API_KEY}`,
      { mode: "cors" }
    );
    const data = await response.json();
    console.log(data);
    const weather = {
      city: coordinates.city,
      time: data.current.dt,
      temp: data.current.temp,
      feelsLike: data.current.feels_like,
      humidity: data.current.humidity,
      weather: data.current.weather[0].description,
      weatherIcon: data.current.weather[0].icon,
    };
    console.log(weather);
    return weather;
  } catch (err) {
    console.log(err);
  }
}

const forms = document.querySelector("form");
const button = document.querySelector("button");
const body = document.querySelector("body");

button.addEventListener("click", async (e) => {
  e.preventDefault();
  if (body.querySelector(".container"))
    body.querySelector(".container").remove();
  const city = e.target.form[0].value;
  let weather = await getWeatherData(city);

  body.appendChild(displayWeatherCard(weather));
});

function displayWeatherCard(weatherObject) {
  const container = document.createElement("div");
  const infoContainer = document.createElement("div");
  const dataContainer = document.createElement("div");
  const weatherTypeContainer = document.createElement("div");
  const weatherDataContainer = document.createElement("div");
  const cityName = document.createElement("h2");
  const time = document.createElement("p");
  const icon = document.createElement("i");
  const description = document.createElement("p");
  const temperature = document.createElement("p");
  const feelsLike = document.createElement("p");
  const humidity = document.createElement("p");

  cityName.innerText = weatherObject.city;
  time.innerText = moment(weatherObject.time, "X").format("lll");
  description.innerText = capitalizeAllWords(weatherObject.weather);
  temperature.innerText = "Temperature: " + weatherObject.temp + "°C";
  feelsLike.innerText = "Feels Like: " + weatherObject.feelsLike + "°C";
  humidity.innerText = "Humiddity: " + weatherObject.humidity + "%";

  container.classList.add("container");
  infoContainer.classList.add("info-container");
  dataContainer.classList.add("data-container");
  weatherTypeContainer.classList.add("weather-type");
  weatherDataContainer.classList.add("weather-data");
  cityName.id = "city-name";
  time.id = "time";
  icon.classList.add("owi", "owi-" + weatherObject.weatherIcon);
  description.id = "description";
  temperature.id = "temperature";
  feelsLike.id = "feels-like";
  humidity.id = "humidity";

  container.append(infoContainer, dataContainer);
  infoContainer.append(cityName, time);
  dataContainer.append(weatherTypeContainer, weatherDataContainer);
  weatherTypeContainer.append(icon, description);
  weatherDataContainer.append(temperature, feelsLike, humidity);

  return container;
}
