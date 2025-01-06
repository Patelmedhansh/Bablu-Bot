const { db } = require('../database/db');

const TECH_QUIZ_QUESTIONS = {
  cloud: [
    {
      question: "What is the AWS service used for serverless computing?",
      correct_answer: "Lambda",
      incorrect_answers: ["EC2", "ECS", "Fargate"],
      difficulty: "medium"
    },
    // Add more cloud questions...
  ],
  devops: [
    {
      question: "Which CI/CD tool is developed by Jenkins?",
      correct_answer: "Jenkins Pipeline",
      incorrect_answers: ["Travis CI", "CircleCI", "GitHub Actions"],
      difficulty: "medium"
    },
    // Add more DevOps questions...
  ],
  // Add more categories...
};

async function getTechQuizQuestion(category) {
  const questions = TECH_QUIZ_QUESTIONS[category];
  const question = questions[Math.floor(Math.random() * questions.length)];
  
  return {
    ...question,
    options: [...question.incorrect_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5)
  };
}

async function updatePoints(userId, points, type) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE house_members 
       SET points = points + ?, 
           ${type} = ${type} + ? 
       WHERE user_id = ?`,
      [points, points, userId],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
  getTechQuizQuestion,
  updatePoints
};