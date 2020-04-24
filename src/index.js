const ComfyJS = require("comfy.js");
require('dotenv').config();
import {Client, PlaceInputType} from "@googlemaps/google-maps-services-js";
import { fetchLatestPodcastEpisode } from './fetchLatestPodcastEpisode';
import { fetchCityWeather } from './fetchCityWeather';

async function fetchGooglePlace(location) {
  const client = new Client({});
  const params = {
    input: location,
    inputtype: PlaceInputType.textQuery,
    key: process.env.GOOGLE_KEY,
    fields: ["name", "geometry/location"]
  };

  const response = await client.findPlaceFromText({ params })
  console.log(JSON.stringify(response.data))
  const result = response.data.candidates.length > 0 ? response.data.candidates[0] : undefined;

  return result
}

async function fetchGoogleTimeZone(place) {
  if (!place) {
    throw new Error('No place was provided to look up time')
  }
  const { geometry: { location }, name } = place;

  const currentTime = (new Date()).getTime()

  const client = new Client({});
  const params = {
    timestamp: currentTime / 1000,
    location,
    key: process.env.GOOGLE_KEY,
  };

  const { data }= await client.timezone({ params })
  const offsetMs = data.rawOffset;

  const offsetTime = new Date(currentTime + offsetMs);
  const dateTime = offsetTime.toLocaleString("en-US", { timeZone: data.timeZoneId })

  return {
    name,
    dateTime,
  }
}

ComfyJS.onCommand = async ( user, command, message, flags, extra ) => {
  const COMMANDS = ['podcast', 'weather', 'time']
  try {
    if( command === "hello" ) {
      ComfyJS.Say(`Hello, ${user}`)
    } else if( command === 'podcast' ) {
      const episode = await fetchLatestPodcastEpisode();
      ComfyJS.Say(`Episode ${episode.episode} season ${episode.season} from Creating Zeal Podcast. ${episode.title}: ${episode.summary} ${episode.url}`)
    } else if( command === 'weather') {
      const currentWeather = await fetchCityWeather(message);
      console.log(currentWeather);
      ComfyJS.Say(currentWeather);
    } else if( command === 'time') {
      const place = await fetchGooglePlace(message)
      const timeInfo = await fetchGoogleTimeZone(place)
      ComfyJS.Say(`The current 📅 and ⏳ ＠ ${timeInfo.name} 👉 ${timeInfo.dateTime}`)
    } else {
      ComfyJS.Say(`Current commands you can use are ${COMMANDS.join(', ')}`)
    }
  } catch (error) {
    console.log('error:', error)
    ComfyJS.Say(`Sorry ${user}, I had an issue running the ${command} command`);
  }
}

ComfyJS.onChat = ( user, message, flags, self, extra ) => {
  console.log( user, message );
  console.log('--------');
}

ComfyJS.Init( process.env.TWITCHUSER, process.env.OAUTH );
