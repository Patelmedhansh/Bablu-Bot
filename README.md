# Bablu Discord Bot - Setup Guide

## Prerequisites
1. Node.js 16.9.0 or higher
2. A Discord account
3. A Replit account (for hosting)

## Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "Bablu"
3. Go to the "Bot" section and click "Add Bot"
4. Under the bot's username, click "Reset Token" and copy the new token
5. Enable these "Privileged Gateway Intents":
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
6. Go to OAuth2 > URL Generator
7. Select these scopes:
   - bot
   - applications.commands
8. Select these bot permissions:
   - Read Messages/View Channels
   - Send Messages
   - Manage Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Add Reactions
   - Use Slash Commands
9. Copy the generated URL and use it to invite the bot to your server

## Environment Setup
Create a `.env` file with these variables:
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
GITHUB_TOKEN=your_github_token
```

## Hosting on Replit
1. Create a new Repl
2. Import from GitHub or upload the bot files
3. Add the environment variables in Replit's Secrets tab
4. Click "Run" to start the bot

## Keep Bot Online 24/7
1. Go to [UptimeRobot](https://uptimerobot.com)
2. Create a new account or login
3. Add a new monitor:
   - Monitor Type: HTTP(s)
   - Friendly Name: Bablu Bot
   - URL: Your Replit project URL
   - Monitoring Interval: 5 minutes

## Deploy Commands
Run this command to deploy slash commands:
```bash
node deploy-commands.js
```

## Testing the Bot
1. Type `/hello` in your server
2. The bot should respond with "Hello from Bablu! 👋"
3. Try `/sortinghat` to test the house sorting system

## Troubleshooting
- If commands don't work, ensure you've run deploy-commands.js
- Check if all required intents are enabled
- Verify the bot has proper permissions in your server
- Check Replit console for any error messages