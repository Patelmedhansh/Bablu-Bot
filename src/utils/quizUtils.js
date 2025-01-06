const { dbOps } = require('../database/db');

async function getTechQuizQuestion(category) {
  const question = await dbOps.getRandomQuestion(category);
  
  if (!question) {
    throw new Error(`No questions available for category: ${category}`);
  }

  return {
    ...question,
    options: [...question.incorrect_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5)
  };
}

async function updatePoints(userId, points, correct) {
  await dbOps.updateUserProgress(userId, correct);
  // Update house points if user is sorted
  await updateHousePoints(userId, points);
}

async function updateHousePoints(userId, points) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE house_members 
       SET points = points + ?,
           quiz_score = quiz_score + ?
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