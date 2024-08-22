const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('핑')
        .setDescription('퐁이라고 응답합니다.'),
    run: ({ interaction }) => {
        interaction.reply("퐁!");
    },
};