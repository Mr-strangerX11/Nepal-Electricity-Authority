const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const { email, password, first_name, last_name, phone, role } = userData;
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);

        const sql = `INSERT INTO users (email, password_hash, first_name, last_name, phone, role) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [email, hashedPassword, first_name, last_name, phone, role || 'customer'];

        db.run(sql, params, function(err) {
          if (err) return reject(err);
          resolve({
            id: this.lastID,
            email,
            first_name,
            last_name,
            role: role || 'customer'
          });
        });
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, email, first_name, last_name, phone, role, is_active FROM users WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  static async getAllByRole(role) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, email, first_name, last_name, phone, role FROM users WHERE role = ? AND is_active = 1';
      db.all(sql, [role], (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });
  }
}

module.exports = User;
