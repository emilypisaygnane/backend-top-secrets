const bcyrpt = require('bcrypt');
const User = require('../models/Users');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcyrpt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
    });
    return user;
  }
};
