require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { initDatabase } = require('./database/db');
const requiredVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
    console.error(`❌ CRITICAL ERROR: Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1); // Stop the bot if variables are missing
} else {
    console.log('✅ Success: All environment variables loaded.');
}

/**
 * Create a new client instance with necessary intents.
 * GuildMembers is required for role assignment and welcoming.
 */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ]
});

// Create commands collection for the command handler
client.commands = new Collection();

// Initialize the SQLite database and create required tables
initDatabase();

// Load commands and events from their respective directories
loadCommands(client);
loadEvents(client);

/**
 * Handle interactions (Slash Commands and Buttons)
 */
client.on('interactionCreate', async (interaction) => {
  // 1. Handle Slash Commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const errorMessage = 'There was an error executing this command!';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
    return;
  }

  // 2. Handle Button Interactions (Used for the Sorting Hat Quiz)
  if (interaction.isButton()) {
    // Check if the button clicked is the "Start Quiz" button for sorting
    if (interaction.customId === 'start_sorting_quiz') {
      try {
        // Defer update to acknowledge the button click immediately
        await interaction.deferUpdate();
        
        // Import utility and database for the quiz logic
        const { runQuiz } = require('./utils/sortingUtils');
        const { db } = require('./database/db');
        
        // Launch the personality-based quiz
        await runQuiz(interaction, db);
      } catch (error) {
        console.error('Error starting sorting quiz:', error);
      }
    }
  }
});

// Global Error handling to keep the bot online
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login to Discord using the token from .env
client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error('Failed to login. Please check your DISCORD_TOKEN in .env:', error);
});