const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');

async function grabbbot(array) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i].split(":");
    const token = element[0];
    if(!token) return console.log("i Can't Find Token on Line Number "+ i+1);
    const channelId = element[1];
    await loginbot(token, channelId); // Wait for loginbot to finish before moving to the next iteration
    await delay(5000);
  }
}

async function loginbot(token, channelid) {
    const client = new Client({ checkUpdate: false });
  client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    const turki = joinVoiceChannel({
        channelId: channelid,
        guildId: require('./config.json').guildid,
        adapterCreator: client.guilds.cache.get(require('./config.json').guildid).voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true,
        group: client.user.id
      });
      setInterval(() => {
        const status = ["online","idle","dnd","invisible"]   
      const Events = ["Muted","Defend","MuteAndDefened","UnmuteAndundefened"]
      const randomevent = Math.floor(Math.random() * RandomEvent.length)
      const randomstatus = Math.floor(Math.random() * status.length)

      }, 300*1000);
  });

  await client.login(token).catch(() => {console.log(`${token} is Not Working!`)}); // Wait for the bot to log in before resolving the Promise
}

function randomupdates() {
  const updates = ["Muted","Defened","MutedAnddefened","unmuteandunDefened"]
  const random = Math.random(Math.floor())
}



fs.readFile('tokens.txt', (err, data) => {
  if (err) {
    fs.writeFileSync('tokens.txt');
    return console.log(`There's no tokens file (I have created it for you)`);
  }
  grabbbot(data.toString().replaceAll("\r", "").trim().split("\n"));
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

