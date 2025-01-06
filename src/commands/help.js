const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📚 Bablu Bot Commands')
      .setColor(0x9b59b6)
      .addFields(
        {
          name: '🏰 House System',
          value: 
            '`/sortinghat` - Get sorted into your house\n' +
            '`/housepoints` - View house points leaderboard\n' +
            '`/points` - Check your personal points and statistics'
        },
        {
          name: '📚 Learning',
          value: 
            '`/techquiz category:[cloud|devops|kubernetes|docker]` - Take a tech quiz\n' +
            '`/trivia` - Answer random trivia questions'
        },
        {
          name: '🎮 Fun',
          value: 
            '`/8ball question:[your question]` - Ask the magic 8-ball\n' +
            '`/meme` - Get a random meme'
        },
        {
          name: '⚙️ Utility',
          value: 
            '`/help` - Show this help message\n' +
            '`/schedule name:[event] time:[YYYY-MM-DD HH:mm]` - Schedule an event'
        }
      )
      .setFooter({ text: 'Made with ❤️ for CloudCraft' });

    await interaction.reply({ embeds: [embed] });
  }
};