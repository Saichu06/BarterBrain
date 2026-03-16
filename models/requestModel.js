const db = require('../config/db');

class RequestModel {
    static async create(userId, skillId, description) {
        const [result] = await db.execute(
            'INSERT INTO requests (user_id, skill_id, description) VALUES (?, ?, ?)',
            [userId, skillId, description]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await db.execute(
            `SELECT r.*, s.skill_name, c.category_name
             FROM requests r
             JOIN skills s ON r.skill_id = s.skill_id
             LEFT JOIN categories c ON s.category_id = c.category_id
             WHERE r.user_id = ?
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async findAllWithDetails() {
        const [rows] = await db.execute(
            `SELECT r.request_id, r.description, r.created_at,
                    u.user_id, u.full_name, u.username,
                    s.skill_name, c.category_name
             FROM requests r
             JOIN users u ON r.user_id = u.user_id
             JOIN skills s ON r.skill_id = s.skill_id
             LEFT JOIN categories c ON s.category_id = c.category_id
             ORDER BY r.created_at DESC`
        );
        return rows;
    }

    static async findById(requestId) {
        const [rows] = await db.execute(
            `SELECT r.*, u.full_name, u.username, u.email, u.phone_number,
                    s.skill_name
             FROM requests r
             JOIN users u ON r.user_id = u.user_id
             JOIN skills s ON r.skill_id = s.skill_id
             WHERE r.request_id = ?`,
            [requestId]
        );
        return rows[0];
    }

    static async delete(requestId) {
        const [result] = await db.execute(
            'DELETE FROM requests WHERE request_id = ?',
            [requestId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = RequestModel;