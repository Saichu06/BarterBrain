const db = require('../config/db');

class UserModel {
    static async create(userData) {
        const { full_name, username, email, phone_number, password } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (full_name, username, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
            [full_name, username, email, phone_number, password]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT user_id, full_name, username, email, phone_number, reputation_score, created_at FROM users WHERE user_id = ?',
            [id]
        );
        return rows[0];
    }

    // ADD THIS METHOD - For public profile viewing (no sensitive data)
    static async findByIdPublic(id) {
        const [rows] = await db.execute(
            `SELECT 
                user_id, 
                full_name, 
                username, 
                email, 
                phone_number, 
                reputation_score, 
                created_at 
            FROM users 
            WHERE user_id = ?`,
            [id]
        );
        return rows[0];
    }

    // Update user profile
    static async update(userId, userData) {
        const { full_name, username, email, phone_number } = userData;
        const [result] = await db.execute(
            'UPDATE users SET full_name = ?, username = ?, email = ?, phone_number = ? WHERE user_id = ?',
            [full_name, username, email, phone_number, userId]
        );
        return result.affectedRows > 0;
    }

    // Update password
    static async updatePassword(userId, hashedPassword) {
        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE user_id = ?',
            [hashedPassword, userId]
        );
        return result.affectedRows > 0;
    }

    // Update reputation score
    static async updateReputation(userId, score) {
        const [result] = await db.execute(
            'UPDATE users SET reputation_score = ? WHERE user_id = ?',
            [score, userId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = UserModel;