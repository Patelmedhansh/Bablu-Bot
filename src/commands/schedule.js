const { SlashCommandBuilder } = require('discord.js');
const schedule = require('node-schedule');
const { db } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('schedule')
    .setDescription('Schedule an event')
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription('Name of the event')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('Time of the event (YYYY-MM-DD HH:mm)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const eventName = interaction.options.getString('name');
    const eventTime = interaction.options.getString('time');
    const eventId = uuidv4();

    try {
      const date = new Date(eventTime);
      
      if (isNaN(date.getTime())) {
        return interaction.reply('Invalid date format! Please use YYYY-MM-DD HH:mm');
      }

      db.run(
        'INSERT INTO scheduled_events (event_id, event_name, event_time, channel_id) VALUES (?, ?, ?, ?)',
        [eventId, eventName, date.toISOString(), interaction.channelId]
      );

      schedule.scheduleJob(date, async () => {
        const channel = await interaction.client.channels.fetch(interaction.channelId);
        channel.send(`🔔 Event Reminder: ${eventName}`);
      });

      await interaction.reply(`Event "${eventName}" scheduled for ${eventTime}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('There was an error scheduling the event!');
    }
  }
};