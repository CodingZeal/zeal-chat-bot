const ComfyJS = require("comfy.js");
require('dotenv').config();
import Parser from 'rss-parser';

const parser = new Parser();

async function fetchLatestPodcastEpisode() {
  let feed = await parser.parseURL('https://feeds.buzzsprout.com/114820.rss');

  const latest = feed.items[0];

  return {
    title: latest.title,
    season: latest.itunes.season,
    episode: latest.itunes.episode,
    summary: latest.itunes.summary,
    url: latest.enclosure.url
  }
}

ComfyJS.onCommand = async ( user, command, message, flags, extra ) => {
  if( command === "hello" ) {
    ComfyJS.Say(`Hello, ${user}`)
  } else if( command === 'podcast' ) {
    const episode = await fetchLatestPodcastEpisode();
    ComfyJS.Say(`Episode ${episode.episode} season ${episode.season} from Creating Zeal Podcast. ${episode.title}: ${episode.summary} ${episode.url}`)
  }
}

ComfyJS.onChat = ( user, message, flags, self, extra ) => {
  console.log( user, message );
}

ComfyJS.Init( process.env.TWITCHUSER, process.env.OAUTH );
