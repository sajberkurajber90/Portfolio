// constants
const APIKEY = 'cc6f4090010c3b2af621a8d3dab6be51';

export const getCurrentWeather = function (city) {
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&APPID=${APIKEY}`;
};

export const get5DaysForecast = function (city) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${APIKEY}`;
};
