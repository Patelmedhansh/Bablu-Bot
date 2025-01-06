const MAGIC_8_BALL_RESPONSES = [
  'It is certain.',
  'Without a doubt.',
  'You may rely on it.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Don\'t count on it.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.'
];

function getRandomResponse() {
  return MAGIC_8_BALL_RESPONSES[Math.floor(Math.random() * MAGIC_8_BALL_RESPONSES.length)];
}

module.exports = {
  getRandomResponse
};