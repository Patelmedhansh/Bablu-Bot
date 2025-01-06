const axios = require('axios');

async function fetchRandomMeme() {
  const response = await axios.get('https://meme-api.com/gimme');
  return {
    title: response.data.title,
    url: response.data.url,
    ups: response.data.ups
  };
}

async function fetchTriviaQuestion() {
  const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
  const question = response.data.results[0];
  
  return {
    question: question.question,
    category: question.category,
    difficulty: question.difficulty,
    correct_answer: question.correct_answer,
    options: [...question.incorrect_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5)
  };
}

module.exports = {
  fetchRandomMeme,
  fetchTriviaQuestion
};