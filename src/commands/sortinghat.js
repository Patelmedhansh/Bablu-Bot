const { SlashCommandBuilder } = require('discord.js');
const { createSortingMessage } = require('../utils/sortingUtils');
const { db } = require('../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sortinghat')
    .setDescription('Start the personality-based house sorting quiz'),
  async execute(interaction) {
    const userId = interaction.user.id;

    db.get('SELECT house FROM house_members WHERE user_id = ?', [userId], async (err, row) => {
      if (row) {
        return interaction.reply({
          content: `The Sorting Hat has already spoken! You belong to ${row.house}.`,
          ephemeral: true
        });
      }
      await createSortingMessage(interaction);
    });
  }
};