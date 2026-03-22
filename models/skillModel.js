const db = require('../config/db');

class SkillModel {
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT s.*, c.category_name 
            FROM skills s
            LEFT JOIN categories c ON s.category_id = c.category_id
            ORDER BY c.category_name, s.skill_name
        `);
        return rows;
    }

    static async getByCategory(categoryId) {
        const [rows] = await db.execute(
            'SELECT * FROM skills WHERE category_id = ?',
            [categoryId]
        );
        return rows;
    }

    static async findById(skillId) {
        const [rows] = await db.execute(
            'SELECT * FROM skills WHERE skill_id = ?',
            [skillId]
        );
        return rows[0];
    }

    static async findByName(skillName) {
        const [rows] = await db.execute(
            'SELECT * FROM skills WHERE skill_name = ?',
            [skillName.trim()]
        );
        return rows[0];
    }

    static async findOrCreate(skillName, categoryId = null) {
        // Trim and normalise skill name (capitalise first letter)
        const cleanName = skillName.trim().charAt(0).toUpperCase() + skillName.trim().slice(1).toLowerCase();

        // Try to find existing skill
        let skill = await this.findByName(cleanName);
        if (skill) return skill.skill_id;

        // Create new skill - ensure categoryId is null if not provided
        const finalCategoryId = (categoryId === null || categoryId === undefined || categoryId === '') 
            ? null 
            : parseInt(categoryId);
        
        const [result] = await db.execute(
            'INSERT INTO skills (skill_name, category_id, is_custom) VALUES (?, ?, ?)',
            [cleanName, finalCategoryId, true]
        );
        return result.insertId;
    }

    static async create(skillName, categoryId) {
        const [result] = await db.execute(
            'INSERT INTO skills (skill_name, category_id) VALUES (?, ?)',
            [skillName, categoryId]
        );
        return result.insertId;
    }
}

module.exports = SkillModel;