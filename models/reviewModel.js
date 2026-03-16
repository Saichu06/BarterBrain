const db = require("../config/db");

class ReviewModel {
  static async create(matchId, rating, comment) {
    const [result] = await db.execute(
      "INSERT INTO reviews (match_id, rating, comment) VALUES (?, ?, ?)",
      [matchId, rating, comment],
    );
    return result.insertId;
  }

  // Add these methods to reviewModel.js

  static async getUserReviews(userId) {
    const [rows] = await db.execute(
      `SELECT r.*, m.offer_id, m.request_id,
                u_offer.full_name as offer_user_name,
                u_request.full_name as request_user_name,
                s_offer.skill_name as offer_skill_name,
                s_request.skill_name as request_skill_name
         FROM reviews r
         JOIN matches m ON r.match_id = m.match_id
         LEFT JOIN offers o ON m.offer_id = o.offer_id
         LEFT JOIN requests req ON m.request_id = req.request_id
         LEFT JOIN users u_offer ON o.user_id = u_offer.user_id
         LEFT JOIN users u_request ON req.user_id = u_request.user_id
         LEFT JOIN skills s_offer ON o.skill_id = s_offer.skill_id
         LEFT JOIN skills s_request ON req.skill_id = s_request.skill_id
         WHERE o.user_id = ? OR req.user_id = ?
         ORDER BY r.created_at DESC`,
      [userId, userId],
    );
    return rows;
  }

  // Add these methods to reviewModel.js

  static async getUserReviewsAsTeacher(userId) {
    const [rows] = await db.execute(
      `SELECT r.*, u.full_name as reviewer_name, s.skill_name
         FROM reviews r
         JOIN matches m ON r.match_id = m.match_id
         JOIN offers o ON m.offer_id = o.offer_id
         JOIN users u ON m.request_id = (SELECT request_id FROM requests WHERE user_id = u.user_id LIMIT 1)
         JOIN skills s ON o.skill_id = s.skill_id
         WHERE o.user_id = ?
         ORDER BY r.created_at DESC`,
      [userId],
    );
    return rows;
  }

  static async getUserReviewsAsLearner(userId) {
    const [rows] = await db.execute(
      `SELECT r.*, u.full_name as reviewer_name, s.skill_name
         FROM reviews r
         JOIN matches m ON r.match_id = m.match_id
         JOIN requests req ON m.request_id = req.request_id
         JOIN users u ON m.offer_id = (SELECT offer_id FROM offers WHERE user_id = u.user_id LIMIT 1)
         JOIN skills s ON req.skill_id = s.skill_id
         WHERE req.user_id = ?
         ORDER BY r.created_at DESC`,
      [userId],
    );
    return rows;
  }

  static async updateUserReputation(userId) {
    const avgRating = await this.getAverageForUser(userId);
    await db.execute(
      "UPDATE users SET reputation_score = ? WHERE user_id = ?",
      [avgRating, userId],
    );
    return avgRating;
  }

  static async getAverageForUser(userId) {
    const [rows] = await db.execute(
      `SELECT AVG(r.rating) as avg_rating
             FROM reviews r
             JOIN matches m ON r.match_id = m.match_id
             JOIN offers o ON m.offer_id = o.offer_id
             WHERE o.user_id = ?
             UNION ALL
             SELECT AVG(r.rating)
             FROM reviews r
             JOIN matches m ON r.match_id = m.match_id
             JOIN requests req ON m.request_id = req.request_id
             WHERE req.user_id = ?`,
      [userId, userId],
    );
    // This returns two rows, we need to combine. Simplify by calculating separately.
    // For simplicity, we'll just calculate the average of all reviews where the user was either offerer or requester.
    const [result] = await db.execute(
      `SELECT AVG(r.rating) as avg_rating
             FROM reviews r
             JOIN matches m ON r.match_id = m.match_id
             LEFT JOIN offers o ON m.offer_id = o.offer_id
             LEFT JOIN requests req ON m.request_id = req.request_id
             WHERE o.user_id = ? OR req.user_id = ?`,
      [userId, userId],
    );
    return result[0].avg_rating || 0;
  }
}

module.exports = ReviewModel;
