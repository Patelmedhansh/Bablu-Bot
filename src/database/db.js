const sqlite3 = require('sqlite3').verbose();
const { TABLES } = require('./schema');
const { questions } = require('./questionBank');

const db = new sqlite3.Database('bot.db');

function initDatabase() {
  db.serialize(() => {
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create tables in correct order (due to foreign key constraints)
    const tableOrder = [
      'QUIZ_QUESTIONS',
      'USER_PROGRESS',
      'QUIZ_HISTORY',
      'HOUSE_MEMBERS'
    ];

    tableOrder.forEach(tableName => {
      db.run(TABLES[tableName], err => {
        if (err) {
          console.error(`Error creating ${tableName} table:`, err);
        } else {
          console.log(`${tableName} table created successfully`);
        }
      });
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
              q.difficulty,
              err => {
                if (err) console.error('Error inserting question:', err);
              }
            );
          });
        });

        stmt.finalize();
        console.log('Quiz questions populated successfully');
      }
    });
  });

  // Verify tables were created
  const tables = ['quiz_questions', 'user_progress', 'quiz_history', 'house_members'];
  tables.forEach(table => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [table], (err, row) => {
      if (err) {
        console.error(`Error checking ${table} table:`, err);
      } else if (!row) {
        console.error(`${table} table was not created properly`);
      } else {
        console.log(`${table} table exists`);
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