const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const QUESTIONS = [
  {
    question: "Which field excites you the most when thinking about the future?",
    options: [
      { label: "Building AI and Cloud systems", house: "Ravenclaw" }, 
      { label: "Leading a startup or managing teams", house: "Slytherin" }, 
      { label: "Creating digital art or storytelling", house: "Gryffindor" }, 
      { label: "Organizing community events", house: "Hufflepuff" } 
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
  
  try {
    // 1. Fetch the latest member data from the guild to ensure proper role assignment
    const member = await interaction.guild.members.fetch(interaction.user.id);
    
    // 2. Find the role by name as it appears in your server
    const role = interaction.guild.roles.cache.find(r => r.name === sortedHouse);

    if (role) {
      // 3. Attempt to add the role and log the outcome
      await member.roles.add(role);
      console.log(`✅ Successfully assigned role ${sortedHouse} to ${member.user.tag}`);
    } else {
      console.error(`❌ Role named "${sortedHouse}" not found in server.`);
    }

    // 4. Update the database record for the user
    db.run('INSERT OR REPLACE INTO house_members (user_id, house) VALUES (?, ?)', [member.id, sortedHouse]);

    const embed = new EmbedBuilder()
      .setTitle(`🎉 Result: ${sortedHouse}!`)
      .setDescription(`Based on your interests in tech, management, and philosophy, you have been sorted into **${sortedHouse}**!`)
      .setColor(role ? role.color : 0x2ecc71);

    await interaction.editReply({ embeds: [embed], components: [] });

  } catch (error) {
    console.error(`❌ Error assigning role in finishQuiz: ${error.message}`);
    
    // Inform the user if there is a permission failure
    const errorDescription = error.message.includes('Missing Permissions')
      ? "I don't have permission to manage roles. Please ensure my role is at the top of the list!"
      : "An error occurred while processing your result.";

    await interaction.editReply({ 
      content: errorDescription, 
      components: [] 
    });
  }
}

module.exports = { createSortingMessage, runQuiz };