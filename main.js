// Import the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const { CommandHandler } = require('djs-commander');
const path = require('path');

dotenv.config();
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

new CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'command'),
});

client.login(token).catch(console.error);