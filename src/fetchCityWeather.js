import axios from 'axios';
const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function fetchCityWeather(cityName) {
  try {
    const { data } = await axios.get(OPEN_WEATHER_URL, {
      params: {
        q: cityName,
        appid: process.env.WEATHER_KEY,
        units: 'imperial'
      }
    });
    const weather = data.weather[0];
    const { temp, feels_like } = data.main;
    return `Right now in ${data.name}, it's ${temp}F but feels like ${feels_like}F with ${weather.description}`;
  }
  catch (error) {
    throw new Error('Sorry, I had an issue fetching the latest weather');
  }
}
