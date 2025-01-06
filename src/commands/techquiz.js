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
      const filter = i => i.user.id === interaction.user.id;

      // Create buttons for options
      const buttons = question.options.map((option, index) => {
        return new ButtonBuilder()
          .setCustomId(`quiz_${index}`)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary);
      });

      // Create action row with buttons
      const row = new ActionRowBuilder().addComponents(buttons);

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
          filter, 
          time: 45000 
        });

        const selectedAnswer = question.options[parseInt(choice.customId.split('_')[1])];
        const isCorrect = selectedAnswer === question.correct_answer;
        
        if (isCorrect) {
          const points = question.difficulty === 'hard' ? 15 : 
                        question.difficulty === 'medium' ? 10 : 5;
          await updatePoints(interaction.user.id, points, true);
        }

        // Disable all buttons after answer
        buttons.forEach(button => button.setDisabled(true));
        if (isCorrect) {
          buttons[parseInt(choice.customId.split('_')[1])].setStyle(ButtonStyle.Success);
        } else {
          buttons[parseInt(choice.customId.split('_')[1])].setStyle(ButtonStyle.Danger);
          // Highlight correct answer
          const correctIndex = question.options.indexOf(question.correct_answer);
          buttons[correctIndex].setStyle(ButtonStyle.Success);
        }

        await choice.update({
          embeds: [{
            title: isCorrect ? '✨ Correct!' : '❌ Incorrect',
            description: `${isCorrect ? 
              `Well done! You earned ${points} points!` : 
              `The correct answer was: ${question.correct_answer}`}`,
            color: isCorrect ? 0x2ecc71 : 0xe74c3c
          }],
          components: [new ActionRowBuilder().addComponents(buttons)]
        });
      } catch (e) {
        // Disable all buttons on timeout
        buttons.forEach(button => button.setDisabled(true));
        await interaction.editReply({
          embeds: [{
            title: '⏰ Time\'s up!',
            description: `The correct answer was: ${question.correct_answer}`,
            color: 0xe74c3c
          }],
          components: [new ActionRowBuilder().addComponents(buttons)]
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('Failed to fetch a quiz question. Try again later!');
    }
  }
};