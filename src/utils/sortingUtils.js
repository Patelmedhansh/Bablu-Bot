const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const QUESTIONS = [
  {
    question: "Which field excites you the most when thinking about the future?",
    options: [
      { label: "Building AI and Cloud systems", house: "Ravenclaw" }, // Tech/Intellectual
      { label: "Leading a startup or managing teams", house: "Slytherin" }, // Management/Ambition
      { label: "Creating digital art or storytelling", house: "Gryffindor" }, // Art/Brave Expression
      { label: "Organizing community events", house: "Hufflepuff" } // Dedication
    ]
  },
  {
    question: "How do you handle a high-pressure situation, like a hackathon deadline?",
    options: [
      { label: "I take charge and push the team forward", house: "Gryffindor" },
      { label: "I find the most efficient shortcut to win", house: "Slytherin" },
      { label: "I analyze the problem and find a logical fix", house: "Ravenclaw" },
      { label: "I support my teammates and stay focused", house: "Hufflepuff" }
    ]
  },
  {
    question: "Which philosophical outlook resonates with you?",
    options: [
      { label: "Knowledge is the ultimate power", house: "Ravenclaw" },
      { label: "The end justifies the means", house: "Slytherin" },
      { label: "Action is better than inaction", house: "Gryffindor" },
      { label: "Equality and fairness for all", house: "Hufflepuff" }
    ]
  }
];

async function createSortingMessage(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🎭 The Sorting Ceremony Quiz')
    .setDescription('Welcome! To find your place in CloudCraft, you must complete the personality assessment. Ready to begin?')
    .setColor(0x9b59b6);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('start_sorting_quiz')
      .setLabel('Start Quiz')
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function runQuiz(interaction, db) {
  let currentQuestion = 0;
  const scores = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };

  const askQuestion = async (int) => {
    if (currentQuestion >= QUESTIONS.length) {
      return finishQuiz(int, scores, db);
    }

    const q = QUESTIONS[currentQuestion];
    const embed = new EmbedBuilder()
      .setTitle(`Question ${currentQuestion + 1}/${QUESTIONS.length}`)
      .setDescription(q.question)
      .setColor(0x3498db);

    const row = new ActionRowBuilder().addComponents(
      q.options.map((opt, i) => 
        new ButtonBuilder()
          .setCustomId(`quiz_ans_${i}`)
          .setLabel(opt.label)
          .setStyle(ButtonStyle.Secondary)
      )
    );

    const msg = await int.editReply({ embeds: [embed], components: [row] });
    
    const collector = msg.createMessageComponentCollector({ 
      filter: i => i.user.id === interaction.user.id, 
      time: 60000, 
      max: 1 
    });

    collector.on('collect', async (i) => {
      const choice = q.options[parseInt(i.customId.split('_')[2])];
      scores[choice.house]++;
      currentQuestion++;
      await i.deferUpdate();
      askQuestion(int);
    });
  };

  await askQuestion(interaction);
}

async function finishQuiz(interaction, scores, db) {
  // Find house with highest score
  const sortedHouse = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  const member = interaction.member;
  const role = interaction.guild.roles.cache.find(r => r.name === sortedHouse);

  // Update Database
  db.run('INSERT OR REPLACE INTO house_members (user_id, house) VALUES (?, ?)', [member.id, sortedHouse]);

  // Assign Role
  if (role) {
    await member.roles.add(role).catch(console.error);
  }

  const embed = new EmbedBuilder()
    .setTitle(`🎉 Result: ${sortedHouse}!`)
    .setDescription(`Based on your interests in tech, management, and philosophy, you have been sorted into **${sortedHouse}**!`)
    .setColor(role ? role.color : 0x2ecc71);

  await interaction.editReply({ embeds: [embed], components: [] });
}

module.exports = { createSortingMessage, runQuiz };