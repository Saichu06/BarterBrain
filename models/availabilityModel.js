const db = require('../config/db');

class AvailabilityModel {
    static async create(userId, day, startTime, endTime) {
        const [result] = await db.execute(
            'INSERT INTO availability (user_id, day, start_time, end_time) VALUES (?, ?, ?, ?)',
            [userId, day, startTime, endTime]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM availability WHERE user_id = ? ORDER BY FIELD(day, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"), start_time',
            [userId]
        );
        return rows;
    }

    static async delete(availabilityId) {
        const [result] = await db.execute(
            'DELETE FROM availability WHERE availability_id = ?',
            [availabilityId]
        );
        return result.affectedRows > 0;
    }

    static async update(availabilityId, day, startTime, endTime) {
        const [result] = await db.execute(
            'UPDATE availability SET day = ?, start_time = ?, end_time = ? WHERE availability_id = ?',
            [day, startTime, endTime, availabilityId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = AvailabilityModel;