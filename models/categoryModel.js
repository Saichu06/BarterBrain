const db = require('../config/db');

class CategoryModel {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM categories ORDER BY category_name');
        return rows;
    }

    static async findById(categoryId) {
        const [rows] = await db.execute('SELECT * FROM categories WHERE category_id = ?', [categoryId]);
        return rows[0];
    }

    static async create(categoryName) {
        const [result] = await db.execute('INSERT INTO categories (category_name) VALUES (?)', [categoryName]);
        return result.insertId;
    }
}

module.exports = CategoryModel;