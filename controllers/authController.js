const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      passwordHash
    });

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
    
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {

    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    const expiresIn = rememberMe ? '21d' : '5s';

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'super_secret_key_notes_app',
      { expiresIn }
    );

    res.json({
      message: 'Успешный вход',
      token,
      expiresIn
    });

  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);

  } catch (error) {
    next(error);
  }
};