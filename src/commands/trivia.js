const { SlashCommandBuilder } = require('discord.js');
const { fetchTriviaQuestion } = require('../utils/apiUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Start a trivia question'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const question = await fetchTriviaQuestion();
      const filter = i => i.user.id === interaction.user.id;
      
      const response = await interaction.editReply({
        embeds: [{
          title: '❓ Trivia Time',
          description: question.question,
          fields: [
            { name: 'Category', value: question.category },
            { name: 'Difficulty', value: question.difficulty }
          ],
          color: 0x3498db,
          footer: { text: 'You have 30 seconds to answer!' }
        }],
        components: [{
          type: 1,
          components: question.options.map((option, index) => ({
            type: 2,
            custom_id: `trivia_${index}`,
            label: option,
            style: 1
          }))
        }]
      });

      try {
        const choice = await response.awaitMessageComponent({ filter, time: 30000 });
        const isCorrect = question.options[parseInt(choice.customId.split('_')[1])] === question.correct_answer;
        
        await choice.update({
          embeds: [{
            title: isCorrect ? '✅ Correct!' : '❌ Wrong!',
            description: `The correct answer was: ${question.correct_answer}`,
            color: isCorrect ? 0x2ecc71 : 0xe74c3c
          }],
          components: []
        });
      } catch (e) {
        await interaction.editReply({
          embeds: [{
            title: '⏰ Time\'s up!',
            description: `The correct answer was: ${question.correct_answer}`,
            color: 0xe74c3c
          }],
          components: []
        });
      }
    } catch (error) {
      await interaction.editReply('Failed to fetch a trivia question. Try again later!');
    }
  }
};