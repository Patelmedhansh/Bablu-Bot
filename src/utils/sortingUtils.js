const { EmbedBuilder } = require('discord.js');

const HOUSE_EMOJIS = {
  '🦁': 'Gryffindor',
  '🐍': 'Slytherin',
  '🦅': 'Ravenclaw',
  '🦡': 'Hufflepuff'
};

const HOUSE_COLORS = {
  Gryffindor: 0xAE0001,
  Slytherin: 0x2A623D,
  Ravenclaw: 0x222F5B,
  Hufflepuff: 0xFFB800
};

const HOUSE_DESCRIPTIONS = {
  Gryffindor: 'Brave, daring, and chivalrous',
  Slytherin: 'Ambitious, cunning, and resourceful',
  Ravenclaw: 'Wise, creative, and intellectual',
  Hufflepuff: 'Loyal, dedicated, and hardworking'
};

async function createSortingMessage(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🎭 The Sorting Ceremony')
    .setDescription(
      'Choose your house by reacting with the corresponding emoji:\n\n' +
      '🦁 Gryffindor - For the brave and daring\n' +
      '🐍 Slytherin - For the ambitious and cunning\n' +
      '🦅 Ravenclaw - For the wise and creative\n' +
      '🦡 Hufflepuff - For the loyal and hardworking'
    )
    .setColor(0x9b59b6);

  const message = await interaction.reply({ 
    embeds: [embed], 
    fetchReply: true 
  });

  // Add reactions
  await message.react('🦁');
  await message.react('🐍');
  await message.react('🦅');
  await message.react('🦡');
}

async function handleSortingReaction(reaction, user, db) {
  const house = HOUSE_EMOJIS[reaction.emoji.name];
  if (!house) return;

  // Check if user is already sorted
  const row = await new Promise((resolve) => {
    db.get('SELECT house FROM house_members WHERE user_id = ?', [user.id], (err, row) => {
      resolve(row);
    });
  });

  if (row) return;

  // Sort user into house
  db.run('INSERT INTO house_members (user_id, house) VALUES (?, ?)', [user.id, house]);

  // Send confirmation message
  const embed = new EmbedBuilder()
    .setTitle(`Welcome to ${house}!`)
    .setDescription(HOUSE_DESCRIPTIONS[house])
    .setColor(HOUSE_COLORS[house])
    .setThumbnail(`https://hogwarts-assets.com/${house.toLowerCase()}.png`);

  const channel = reaction.message.channel;
  await channel.send({ 
    content: `<@${user.id}>`,
    embeds: [embed] 
  });
}

module.exports = {
  createSortingMessage,
  handleSortingReaction,
  HOUSE_EMOJIS
};