const { SlashCommandBuilder } = require('discord.js');
const { createSortingMessage } = require('../utils/sortingUtils');
const { db } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sortinghat')
    .setDescription('Start the house sorting ceremony'),
  async execute(interaction) {
    const userId = interaction.user.id;

    // Check if already sorted
    db.get('SELECT house FROM house_members WHERE user_id = ?', [userId], async (err, row) => {
      if (row) {
        await interaction.reply({
          content: `You've already been sorted into ${row.house}!`,
          ephemeral: true
        });
        return;
      }

      await createSortingMessage(interaction);
    });
  }
};