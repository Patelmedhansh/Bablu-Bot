const { Events } = require('discord.js');
const { handleSortingReaction, HOUSE_EMOJIS } = require('../utils/sortingUtils');
const { db } = require('../database/db');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot) return;
    
    // Check if reaction is a house emoji
    if (HOUSE_EMOJIS[reaction.emoji.name]) {
      await handleSortingReaction(reaction, user, db);
    }
  }
};