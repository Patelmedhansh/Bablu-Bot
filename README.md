# Bablu - Discord Bot for CloudCraft Community 🤖

A feature-rich Discord bot designed for the CloudCraft community, combining Harry Potter-themed elements with tech learning features.

## Features ✨

### House System 🏰
- Sorting ceremony with house selection
- House points tracking system
- Points earned through:
  - Quiz participation
  - Server activity
  - Hackathon wins

### Tech Quiz System 📚
- Categories:
  - Cloud Computing
  - DevOps
  - Kubernetes
  - Docker
- Difficulty levels with varying point rewards
- Interactive quiz interface

### Fun Commands 🎮
- Magic 8-ball predictions
- Random memes
- Trivia questions

## Command List 🎯

### House System
\`\`\`
/sortinghat - Start house sorting ceremony
/housepoints - View house points leaderboard
\`\`\`

### Learning
\`\`\`
/techquiz category:[cloud|devops|kubernetes|docker] - Take a technical quiz
/trivia - Answer random trivia questions
\`\`\`

### Fun
\`\`\`
/8ball question:[your question] - Ask the magic 8-ball
/meme - Get a random meme
\`\`\`

### Utility
\`\`\`
/help - Show all available commands
/schedule name:[event] time:[YYYY-MM-DD HH:mm] - Schedule an event
\`\`\`

## Setup Guide 🚀

### Prerequisites 📋
- Node.js 16.9.0 or higher
- Discord Bot Token
- Discord Server with admin privileges

### Bot Setup Steps

1. **Create Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and name it
   - Go to "Bot" section and create a bot
   - Enable these Privileged Gateway Intents:
     - Presence Intent
     - Server Members Intent
     - Message Content Intent

2. **Configure Environment**
   Create a \`.env\` file:
   \`\`\`
   DISCORD_TOKEN=your_bot_token
   CLIENT_ID=your_application_id
   GUILD_ID=your_server_id
   \`\`\`

3. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

4. **Deploy Commands**
   \`\`\`bash
   node deploy-commands.js
   \`\`\`

5. **Start the Bot**
   \`\`\`bash
   npm start
   \`\`\`

### Required Bot Permissions
- Read Messages/View Channels
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions
- Use Slash Commands

## Support 💬
For support, join our Discord server or open an issue in the repository.

## License 📄
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.