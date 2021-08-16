import { WebhookClient } from 'discord.js';
import { config } from 'dotenv';
import Instagram from 'instagram-web-api';
import { existsSync, readFileSync, writeFileSync } from 'fs';

config();

const discord = new WebhookClient({
  id: process.env.ID ?? '',
  token: process.env.TOKEN ?? '',
});

const instagram = new Instagram({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

const fetchFollowers = async () => {
  console.log('Fetching followers');
  try {
    const { count } = await instagram.getFollowers({
      userId: process.env.USER_ID,
    });
    if (existsSync('followers')) {
      const prevCount = Number(readFileSync('followers').toString());
      if (count === prevCount) return;
    }

    console.log(count);
    discord.send(`Fundl now has ${count} followers!`);

    writeFileSync('followers', count.toString());
  } catch (e) {
    console.log('Fetch failed');
  }
};

const main = async () => {
  fetchFollowers();
  setInterval(fetchFollowers, 1000 * 60);
};

main();
