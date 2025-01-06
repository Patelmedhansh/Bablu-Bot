const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Get a greeting from Bablu!'),
  async execute(interaction) {
    await interaction.reply('Hello from Bablu! 👋');
  }
};