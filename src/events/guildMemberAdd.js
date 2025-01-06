const { Events } = require('discord.js');
const { db } = require('../database/db');

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
    // Welcome message
    const welcomeChannel = member.guild.channels.cache.find(
      channel => channel.name === 'welcome'
    );
    
    if (welcomeChannel) {
      welcomeChannel.send(
        `Welcome to CloudCraft, ${member}! 🎉 Please read our rules and enjoy your stay!`
      );
    }

    // Add user to database
    db.run(
      'INSERT OR IGNORE INTO users (user_id, join_date) VALUES (?, ?)',
      [member.id, new Date().toISOString()]
    );
  }
};