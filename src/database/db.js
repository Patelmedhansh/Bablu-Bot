const sqlite3 = require('sqlite3').verbose();
const { TABLES } = require('./schema');
const { questions } = require('./questionBank');

const db = new sqlite3.Database('bot.db');

function initDatabase() {
  db.serialize(() => {
    // Create tables
    Object.values(TABLES).forEach(tableQuery => {
      db.run(tableQuery);
    });

    // Populate quiz questions if empty
    db.get('SELECT COUNT(*) as count FROM quiz_questions', [], (err, row) => {
      if (err) {
        console.error('Error checking quiz questions:', err);
        return;
      }

      if (row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO quiz_questions (
            category, question, correct_answer, incorrect_answers, difficulty
          ) VALUES (?, ?, ?, ?, ?)
        `);

        Object.entries(questions).forEach(([category, categoryQuestions]) => {
          categoryQuestions.forEach(q => {
            stmt.run(
              category,
              q.question,
              q.correct_answer,
              JSON.stringify(q.incorrect_answers),
              q.difficulty
            );
          });
        });

        stmt.finalize();
        console.log('Quiz questions populated successfully');
      }
    });
  });
}

// Helper functions for database operations
const dbOps = {
  // Get random question from specific category
  getRandomQuestion: (category) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM quiz_questions WHERE category = ? ORDER BY RANDOM() LIMIT 1',
        [category],
        (err, row) => {
          if (err) reject(err);
          if (row) {
            row.incorrect_answers = JSON.parse(row.incorrect_answers);
          }
          resolve(row);
        }
      );
    });
  },

  // Update user progress
  updateUserProgress: (userId, correct) => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO user_progress (
          user_id, total_questions, correct_answers, last_quiz_date
        ) VALUES (?, 1, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          total_questions = total_questions + 1,
          correct_answers = correct_answers + ?,
          last_quiz_date = CURRENT_TIMESTAMP
      `, [userId, correct ? 1 : 0, correct ? 1 : 0], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },

  // Get user statistics
  getUserStats: (userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM user_progress WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          resolve(row || {
            total_questions: 0,
            correct_answers: 0,
            points: 0,
            streak: 0
          });
        }
      );
    });
  }
};

module.exports = {
  db,
  initDatabase,
  dbOps
};