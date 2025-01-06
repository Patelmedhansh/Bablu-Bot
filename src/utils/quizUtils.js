const { db, dbOps } = require('../database/db');

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
  try {
    // Update user progress
    await dbOps.updateUserProgress(userId, correct);
    
    // Update house points
    await db.run(
      `UPDATE house_members 
       SET points = points + ?,
           quiz_score = quiz_score + ?
       WHERE user_id = ?`,
      [points, points, userId]
    );
  } catch (error) {
    console.error('Error updating points:', error);
    throw new Error('Failed to update points');
  }
}

module.exports = {
  getTechQuizQuestion,
  updatePoints
};