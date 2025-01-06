Bablu - Discord Bot for CloudCraft Community

Bablu is a feature-rich Discord bot designed for the CloudCraft community, blending Harry Potter-themed elements with tech learning features to create an engaging and educational experience.

Features ✨
	•	House System: Participate in a sorting ceremony, join a house, and earn points through various activities.
	•	Tech Quiz System: Test your knowledge in Cloud Computing, DevOps, Kubernetes, and Docker with quizzes of varying difficulty levels.
	•	Fun Commands: Enjoy magic 8-ball predictions, random memes, and trivia questions to keep the community lively.

Getting Started 🚀

Follow these steps to set up Bablu for your Discord server:

Prerequisites
	•	Node.js (version 14 or higher)
	•	Discord.js library
	•	A Discord bot token from the Discord Developer Portal

Installation
	1.	Clone the repository:

git clone https://github.com/Patelmedhansh/Bablu-Bot.git
cd Bablu-Bot


	2.	Install dependencies:

npm install


	3.	Set up environment variables:
Create a .env file in the root directory and add your Discord bot token:

DISCORD_TOKEN=your_discord_bot_token


	4.	Deploy commands:

node deploy-commands.js


	5.	Start the bot:

node index.js



Usage 📚

Once the bot is running, you can interact with it using the following commands:

House System
	•	/sortinghat: Start the house sorting ceremony.
	•	/housepoints: View the house points leaderboard.

Learning
	•	/techquiz category:[cloud|devops|kubernetes|docker]: Take a technical quiz in the specified category.
	•	/trivia: Answer random trivia questions.

Fun
	•	/8ball question:[your_question]: Get a magic 8-ball prediction.
	•	/meme: Receive a random meme.

Contributing 🤝

We welcome contributions from developers, designers, documentation writers, and tech enthusiasts! To contribute:
	1.	Fork the repository.
	2.	Create a new branch for your feature or bug fix.
	3.	Make your changes and ensure they are well-tested.
	4.	Submit a pull request with a detailed description of your changes.

For major changes, please open an issue first to discuss what you would like to change.

License 📄

This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments 🙌

Special thanks to the CloudCraft community for their inspiration and support in developing this bot.
