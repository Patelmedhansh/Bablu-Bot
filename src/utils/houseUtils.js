const { db } = require('../database/db');

const HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

function sortIntoHouse() {
  return HOUSES[Math.floor(Math.random() * HOUSES.length)];
}

async function getHousePoints() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        house,
        SUM(points) as total_points,
        SUM(quiz_score) as quiz_score,
        SUM(activity_score) as activity_score,
        SUM(hackathon_wins) as hackathon_wins
      FROM house_members
      GROUP BY house
      ORDER BY total_points DESC
    `, [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  sortIntoHouse,
  getHousePoints
};