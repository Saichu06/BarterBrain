const db = require('../config/db');

class OfferModel {
    static async create(userId, skillId, description) {
        const [result] = await db.execute(
            'INSERT INTO offers (user_id, skill_id, description) VALUES (?, ?, ?)',
            [userId, skillId, description]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await db.execute(
            `SELECT o.*, s.skill_name
             FROM offers o
             JOIN skills s ON o.skill_id = s.skill_id
             WHERE o.user_id = ?`,
            [userId]
        );
        return rows;
    }

    static async findAllWithDetails() {
        const [rows] = await db.execute(
            `SELECT o.offer_id, o.description, o.created_at,
                    u.user_id, u.full_name, u.username,
                    s.skill_name, c.category_name
             FROM offers o
             JOIN users u ON o.user_id = u.user_id
             JOIN skills s ON o.skill_id = s.skill_id
             LEFT JOIN categories c ON s.category_id = c.category_id`
        );
        return rows;
    }

    // ADD THIS METHOD
    static async delete(offerId) {
        const [result] = await db.execute(
            'DELETE FROM offers WHERE offer_id = ?',
            [offerId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = OfferModel;