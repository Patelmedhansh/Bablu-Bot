const TABLES = {
    QUIZ_QUESTIONS: `
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        incorrect_answers TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    
    USER_PROGRESS: `
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id TEXT PRIMARY KEY,
        total_questions INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        last_quiz_date DATETIME,
        streak INTEGER DEFAULT 0
      )
    `,
  
    QUIZ_HISTORY: `
      CREATE TABLE IF NOT EXISTS quiz_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        question_id INTEGER NOT NULL,
        correct BOOLEAN NOT NULL,
        answer_time INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(question_id) REFERENCES quiz_questions(id)
      )
    `,
  
    HOUSE_MEMBERS: `
      CREATE TABLE IF NOT EXISTS house_members (
        user_id TEXT PRIMARY KEY,
        house TEXT NOT NULL,
        points INTEGER DEFAULT 0,
        quiz_score INTEGER DEFAULT 0,
        activity_score INTEGER DEFAULT 0,
        hackathon_wins INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
  };
  
  module.exports = { TABLES };