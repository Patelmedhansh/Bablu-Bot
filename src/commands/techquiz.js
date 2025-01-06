const { SlashCommandBuilder } = require('discord.js');
const { getTechQuizQuestion, updatePoints } = require('../utils/quizUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('techquiz')
    .setDescription('Start a cloud computing or DevOps quiz')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Quiz category')
        .setRequired(true)
        .addChoices(
          { name: 'Cloud Computing', value: 'cloud' },
          { name: 'DevOps', value: 'devops' },
          { name: 'Kubernetes', value: 'k8s' },
          { name: 'Docker', value: 'docker' }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();
    
    try {
      const category = interaction.options.getString('category');
      const question = await getTechQuizQuestion(category);
      const filter = i => i.user.id === interaction.user.id;

      const response = await interaction.editReply({
        embeds: [{
          title: '🚀 Tech Quiz',
          description: question.question,
          fields: [
            { name: 'Category', value: question.category },
            { name: 'Difficulty', value: question.difficulty }
          ],
          color: 0x3498db
        }],
        components: [{
          type: 1,
          components: question.options.map((option, index) => ({
            type: 2,
            custom_id: `quiz_${index}`,
            label: option,
            style: 1
          }))
        }]
      });

      try {
        const choice = await response.awaitMessageComponent({ filter, time: 45000 });
        const isCorrect = question.options[parseInt(choice.customId.split('_')[1])] === question.correct_answer;
        
        if (isCorrect) {
          const points = question.difficulty === 'hard' ? 15 : question.difficulty === 'medium' ? 10 : 5;
          await updatePoints(interaction.user.id, points, 'quiz_score');
        }

        await choice.update({
          embeds: [{
            title: isCorrect ? '✨ Correct!' : '❌ Incorrect',
            description: `${isCorrect ? `Well done! You earned ${points} points for your house!` : 'Better luck next time!'}\n\nThe correct answer was: ${question.correct_answer}`,
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
      await interaction.editReply('Failed to fetch a quiz question. Try again later!');
    }
  }
};