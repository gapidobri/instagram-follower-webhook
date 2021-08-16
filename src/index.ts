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
  username: process.env.AUTH_USERNAME,
  password: process.env.AUTH_PASSWORD,
});

const fetchFollowers = async () => {
  console.log('Fetching followers');
  try {
    const user = await instagram.getUserByUsername({
      username: process.env.USERNAME,
    });

    const count = user.edge_followed_by.count;

    if (existsSync('followers')) {
      const prevCount = Number(readFileSync('followers').toString());
      if (count === prevCount) return;
    }

    console.log(count);
    discord.send(`Fundl now has ${count} followers!`);

    writeFileSync('followers', count.toString());
  } catch (e) {
    console.log('Fetch failed');
    await instagram.login();
    fetchFollowers();
  }
};

const main = async () => {
  await instagram.login();
  fetchFollowers();
  setInterval(fetchFollowers, 1000 * 60);
};

main();
