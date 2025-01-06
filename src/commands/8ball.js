const { SlashCommandBuilder } = require('discord.js');
const { getRandomResponse } = require('../utils/responseUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your question for the magic 8-ball')
        .setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const response = getRandomResponse();
    
    await interaction.reply({
      embeds: [{
        title: '🎱 Magic 8-Ball',
        fields: [
          { name: 'Question', value: question },
          { name: 'Answer', value: response }
        ],
        color: 0x9b59b6
      }]
    });
  }
};