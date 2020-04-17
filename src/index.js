const ComfyJS = require("comfy.js");
require('dotenv').config();
import {Client, PlaceInputType} from "@googlemaps/google-maps-services-js";
import { fetchLatestPodcastEpisode } from './fetchLatestPodcastEpisode';
import { fetchCityWeather } from './fetchCityWeather';

async function fetchGoogleInfo(location) {
  const client = new Client({});
  const params = {
    input: "google",
    inputtype: PlaceInputType.textQuery,
    key: process.env.GOOGLE_KEY,
    fields: ["name", "utc_offset"]
  };

  const response = await client.findPlaceFromText({ params })
  console.log(response.data)
}

ComfyJS.onCommand = async ( user, command, message, flags, extra ) => {
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
      const currentWeather = await fetchGoogleInfo(message);
    }
  } catch (error) {
    console.log('error:', error)
    ComfyJS.Say(`Sorry ${user}, I had an issue running the ${command} command`);
  }
}

ComfyJS.onChat = ( user, message, flags, self, extra ) => {
  console.log( user, message );
}

ComfyJS.Init( process.env.TWITCHUSER, process.env.OAUTH );
