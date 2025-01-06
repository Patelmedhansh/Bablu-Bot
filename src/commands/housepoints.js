const { SlashCommandBuilder } = require('discord.js');
const { getHousePoints } = require('../utils/houseUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('housepoints')
    .setDescription('View house points leaderboard'),
  async execute(interaction) {
    const points = await getHousePoints();
    
    await interaction.reply({
      embeds: [{
        title: '🏆 House Points Leaderboard',
        fields: points.map(house => ({
          name: house.name,
          value: `${house.points} points\n` +
                 `Quiz Score: ${house.quiz_score}\n` +
                 `Activity: ${house.activity_score}\n` +
                 `Hackathons: ${house.hackathon_wins * 50}`,
          inline: true
        })),
        color: 0xffd700
      }]
    });
  }
};