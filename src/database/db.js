const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('bot.db');

function initDatabase() {
  db.serialize(() => {
    // Existing tables...

    // Houses and points system
    db.run(`CREATE TABLE IF NOT EXISTS house_members (
      user_id TEXT PRIMARY KEY,
      house TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      quiz_score INTEGER DEFAULT 0,
      activity_score INTEGER DEFAULT 0,
      hackathon_wins INTEGER DEFAULT 0
    )`);

    // Quiz questions
    db.run(`CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      incorrect_answers TEXT NOT NULL,
      difficulty TEXT NOT NULL
    )`);
  });
}

module.exports = {
  db,
  initDatabase
};