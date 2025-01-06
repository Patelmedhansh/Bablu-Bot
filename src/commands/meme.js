const { SlashCommandBuilder } = require('discord.js');
const { fetchRandomMeme } = require('../utils/apiUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const meme = await fetchRandomMeme();
      await interaction.editReply({
        embeds: [{
          title: meme.title,
          image: { url: meme.url },
          color: 0x00ff00,
          footer: { text: `👍 ${meme.ups || 0}` }
        }]
      });
    } catch (error) {
      await interaction.editReply('Failed to fetch a meme. Try again later!');
    }
  }
};