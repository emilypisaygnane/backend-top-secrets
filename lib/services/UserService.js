const bcrypt = require('bcrypt');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

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

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);

      if (!user) throw new Error('Invalid Email');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid Password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 Day',
      });

      return token;
    } catch (e) {
      e.status = 401;
      throw e;
    }
  }
};
