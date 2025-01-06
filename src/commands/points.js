const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dbOps } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('points')
    .setDescription('Check your points and quiz statistics'),
  async execute(interaction) {
    try {
      // Get user stats from both tables
      const [userStats, houseStats] = await Promise.all([
        dbOps.getUserStats(interaction.user.id),
        new Promise((resolve, reject) => {
          interaction.client.db.get(
            'SELECT house, points, quiz_score, activity_score, hackathon_wins FROM house_members WHERE user_id = ?',
            [interaction.user.id],
            (err, row) => {
              if (err) reject(err);
              resolve(row);
            }
          );
        })
      ]);

      const embed = new EmbedBuilder()
        .setTitle('🏆 Your Statistics')
        .setColor(0xffd700)
        .addFields(
          { 
            name: '🏠 House',
            value: houseStats ? houseStats.house : 'Not sorted yet',
            inline: true
          },
          { 
            name: '📊 Total Points',
            value: houseStats ? `${houseStats.points}` : '0',
            inline: true
          },
          { 
            name: '📚 Quiz Performance',
            value: `Correct: ${userStats.correct_answers}/${userStats.total_questions}\n` +
                   `Success Rate: ${userStats.total_questions > 0 
                     ? Math.round((userStats.correct_answers / userStats.total_questions) * 100)
                     : 0}%`,
            inline: false
          }
        );

      if (houseStats) {
        embed.addFields(
          { 
            name: '🎯 Point Breakdown',
            value: `Quiz Score: ${houseStats.quiz_score}\n` +
                   `Activity Score: ${houseStats.activity_score}\n` +
                   `Hackathon Wins: ${houseStats.hackathon_wins * 50} (${houseStats.hackathon_wins} wins)`,
            inline: false
          }
        );
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Error fetching points:', error);
      await interaction.reply({ 
        content: 'Failed to fetch your points. Please try again later.',
        ephemeral: true 
      });
    }
  }
};