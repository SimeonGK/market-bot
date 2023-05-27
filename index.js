// Require the necessary discord.js classes
const {
  Client, Events, GatewayIntentBits, ActivityType,
} = require('discord.js');
const axios = require('axios');
const { DiscordToken } = require('./config.json');

const marketName = 'HGB/SOL';
const marketId = '6FcJaAzQnuoA6o3sVw1GD6Ba69XuL5jinZpQTzJhd2R3';
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const updateFloorPrice = () => {
  axios.get('https://honeyfinance.xyz/marketData') // api call magic eden
    .then((res) => {
      const marketData = res.data.find((obj) => obj.marketId === marketId)?.data;
      const { nftPrice, interestRate, totalMarketDeposits } = marketData;
      //  console.log(marketData);
      const borrowAmount = (nftPrice * 0.50).toFixed(2);
      const interest = (interestRate * 100).toFixed(2);
      console.log(nftPrice, borrowAmount, interestRate, totalMarketDeposits);
      client.user.setActivity(`◎ ${borrowAmount}`, { type: ActivityType.Watching });
      client.guilds.cache.forEach((guild) => {
        const member = guild.members.cache.get(client.user.id);
        console.log(`Guild: ${guild.name} | Bot Member ID: ${member.id}`);
        member.setNickname(`◎ ${totalMarketDeposits.toFixed(2)} | ${interest}%`)
          .then((updatedMember) => {
            console.log(`Changed nickname of ${updatedMember.user.username} to ${totalMarketDeposits.toFixed(2)} SOL | ${interest}% `);
          })
          .catch(console.error);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  setTimeout(updateFloorPrice, 1000 * 60); // every minute seconds
};
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  c.user.setUsername(marketName);
  const newAvatar = './images/logo.png';
  c.user.setAvatar(newAvatar)
    .then(() => console.log('Avatar changed successfully!'))
    .catch(console.error);
  updateFloorPrice();
});

client.login(DiscordToken);
