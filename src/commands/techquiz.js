const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
      
      // Create buttons for options
      const row = new ActionRowBuilder()
        .addComponents(
          question.options.map((option, index) => 
            new ButtonBuilder()
              .setCustomId(`quiz_${index}`)
              .setLabel(option)
              .setStyle(ButtonStyle.Primary)
          )
        );

      const response = await interaction.editReply({
        embeds: [{
          title: '🚀 Tech Quiz',
          description: question.question,
          fields: [
            { name: 'Category', value: category },
            { name: 'Difficulty', value: question.difficulty }
          ],
          color: 0x3498db
        }],
        components: [row]
      });

      try {
        const choice = await response.awaitMessageComponent({ 
          filter: i => i.user.id === interaction.user.id,
          time: 45000 
        });

        const selectedIndex = parseInt(choice.customId.split('_')[1]);
        const selectedAnswer = question.options[selectedIndex];
        const isCorrect = selectedAnswer === question.correct_answer;
        let points = 0;

        if (isCorrect) {
          points = question.difficulty === 'hard' ? 15 : 
                  question.difficulty === 'medium' ? 10 : 5;
          await updatePoints(interaction.user.id, points, true);
        }

        // Create new buttons with updated styles
        const updatedRow = new ActionRowBuilder()
          .addComponents(
            question.options.map((option, index) => {
              const button = new ButtonBuilder()
                .setCustomId(`quiz_${index}`)
                .setLabel(option)
                .setDisabled(true);

              if (index === selectedIndex) {
                button.setStyle(isCorrect ? ButtonStyle.Success : ButtonStyle.Danger);
              } else if (option === question.correct_answer) {
                button.setStyle(ButtonStyle.Success);
              } else {
                button.setStyle(ButtonStyle.Secondary);
              }

              return button;
            })
          );

        await choice.update({
          embeds: [{
            title: isCorrect ? '✨ Correct!' : '❌ Incorrect',
            description: isCorrect ? 
              `Well done! You earned ${points} points!` : 
              `The correct answer was: ${question.correct_answer}`,
            color: isCorrect ? 0x2ecc71 : 0xe74c3c
          }],
          components: [updatedRow]
        });

      } catch (error) {
        if (error.name === 'Error [InteractionCollectorError]') {
          // Handle timeout
          const timeoutRow = new ActionRowBuilder()
            .addComponents(
              question.options.map((option) => {
                const button = new ButtonBuilder()
                  .setCustomId(`quiz_${question.options.indexOf(option)}`)
                  .setLabel(option)
                  .setDisabled(true)
                  .setStyle(option === question.correct_answer ? 
                    ButtonStyle.Success : ButtonStyle.Secondary);
                return button;
              })
            );

          await interaction.editReply({
            embeds: [{
              title: '⏰ Time\'s up!',
              description: `The correct answer was: ${question.correct_answer}`,
              color: 0xe74c3c
            }],
            components: [timeoutRow]
          });
        } else {
          console.error('Quiz error:', error);
          await interaction.editReply('An error occurred while processing your answer.');
        }
      }
    } catch (error) {
      console.error('Quiz setup error:', error);
      await interaction.editReply('Failed to fetch a quiz question. Try again later!');
    }
  }
};