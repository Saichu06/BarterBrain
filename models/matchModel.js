const db = require("../config/db");

class MatchModel {
  // Find potential matches for a given request (or offer)
  static async findMatchesForRequest(requestId) {
    // Get the skill_id from the request
    const [requestRows] = await db.execute(
      "SELECT skill_id FROM requests WHERE request_id = ?",
      [requestId],
    );
    if (requestRows.length === 0) return [];
    const skillId = requestRows[0].skill_id;

    // Find all offers for the same skill that are not already matched with this request
    const [offers] = await db.execute(
      `SELECT o.*, u.full_name, u.username 
             FROM offers o
             JOIN users u ON o.user_id = u.user_id
             WHERE o.skill_id = ? AND o.offer_id NOT IN (
                 SELECT offer_id FROM matches WHERE request_id = ?
             )`,
      [skillId, requestId],
    );
    return offers;
  }

  static async create(offerId, requestId) {
    const [result] = await db.execute(
      "INSERT INTO matches (offer_id, request_id) VALUES (?, ?)",
      [offerId, requestId],
    );
    return result.insertId;
  }

  static async updateStatus(matchId, status) {
    await db.execute("UPDATE matches SET status = ? WHERE match_id = ?", [
      status,
      matchId,
    ]);
  }

  // Add these methods to matchModel.js

  static async findById(matchId) {
    const [rows] = await db.execute(
      `SELECT m.*,
                o.user_id as offer_user_id, o.skill_id as offer_skill_id,
                r.user_id as request_user_id, r.skill_id as request_skill_id,
                u_offer.full_name as offer_user_name,
                u_request.full_name as request_user_name,
                s_offer.skill_name as offer_skill_name,
                s_request.skill_name as request_skill_name
         FROM matches m
         JOIN offers o ON m.offer_id = o.offer_id
         JOIN requests r ON m.request_id = r.request_id
         JOIN users u_offer ON o.user_id = u_offer.user_id
         JOIN users u_request ON r.user_id = u_request.user_id
         JOIN skills s_offer ON o.skill_id = s_offer.skill_id
         JOIN skills s_request ON r.skill_id = s_request.skill_id
         WHERE m.match_id = ?`,
      [matchId],
    );
    return rows[0];
  }

  static async findByOfferAndRequest(offerId, requestId) {
    const [rows] = await db.execute(
      "SELECT * FROM matches WHERE offer_id = ? AND request_id = ?",
      [offerId, requestId],
    );
    return rows[0];
  }

  static async findByUser(userId) {
    const [rows] = await db.execute(
      `SELECT m.*, 
                    o.user_id as offer_user_id, o.skill_id as offer_skill_id,
                    r.user_id as request_user_id, r.skill_id as request_skill_id,
                    u_offer.full_name as offer_user_name,
                    u_request.full_name as request_user_name,
                    s_offer.skill_name as offer_skill_name,
                    s_request.skill_name as request_skill_name
             FROM matches m
             JOIN offers o ON m.offer_id = o.offer_id
             JOIN requests r ON m.request_id = r.request_id
             JOIN users u_offer ON o.user_id = u_offer.user_id
             JOIN users u_request ON r.user_id = u_request.user_id
             JOIN skills s_offer ON o.skill_id = s_offer.skill_id
             JOIN skills s_request ON r.skill_id = s_request.skill_id
             WHERE o.user_id = ? OR r.user_id = ?`,
      [userId, userId],
    );
    return rows;
  }
}

module.exports = MatchModel;
