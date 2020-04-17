import Parser from 'rss-parser';
export const parser = new Parser();

export async function fetchLatestPodcastEpisode() {
  let feed = await parser.parseURL('https://feeds.buzzsprout.com/114820.rss');
  const latest = feed.items[0];
  return {
    title: latest.title,
    season: latest.itunes.season,
    episode: latest.itunes.episode,
    summary: latest.itunes.summary,
    url: latest.enclosure.url
  };
}
