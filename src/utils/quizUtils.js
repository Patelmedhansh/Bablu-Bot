const { db, dbOps } = require('../database/db');

async function getTechQuizQuestion(category) {
  const question = await dbOps.getRandomQuestion(category);
  if (!question) throw new Error(`No questions available for category: ${category}`);
  return {
    ...question,
    options: [...question.incorrect_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5)
  };
}

async function updatePoints(userId, points, correct) {
  try {
    // Update user progress AND the points column in user_progress
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO user_progress (user_id, total_questions, correct_answers, points, last_quiz_date)
        VALUES (?, 1, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          total_questions = total_questions + 1,
          correct_answers = correct_answers + ?,
          points = points + ?,
          last_quiz_date = CURRENT_TIMESTAMP
      `, [userId, correct ? 1 : 0, points, correct ? 1 : 0, points], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    
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

module.exports = { getTechQuizQuestion, updatePoints };