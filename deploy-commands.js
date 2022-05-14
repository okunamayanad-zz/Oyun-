const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, guildOnlyMode } = require('./config.json');
const { token } = process.env['token']

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

function appGldCmdsAttrs() {
	if (guildOnlyMode == true) {
		return clientId + ", " + guildId
	} else {
		return clientId
	}
}

rest.put(Routes.applicationGuildCommands(appGldCmdsAttrs()), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
