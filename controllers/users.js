const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundErr } = require('../errors/NotFoundErr');
const { BadRequest } = require('../errors/BadRequest');
const { Unauthorized } = require('../errors/Unauthorized');
const { Conflict } = require('../errors/Conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getId = async (req, res, next) => {
  try {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          throw new NotFoundErr('Пользователь не найден');
        } else {
          res.send({ data: user });
        }
      });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.createUsers = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new Conflict('Такой Email существует'));
    } else {
      next(err);
    }
  }
};
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => (err.name === 'ValidationError'
//       ? res.status(400).send({
//         message: 'Переданы некорректные данные при создании пользователя',
//       })
//       : res.status(500).send({ message: 'Ошибка сервера' })));
// };

module.exports.createMe = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundErr('Пользователь с id не найден');
    }
    res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequest('Некорректные данные'));
    } else {
      next(error);
    }
  }
};

module.exports.createUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные для обновления аватара'));
      } else {
        next(err);
      }
    });
};

module.exports.getMe = async (req, res, next) => {
  try {
    const user = User.findById(req.user._id);
    if (!user) {
      throw new NotFoundErr('Пользователь с id не найден');
    } else {
      res.send({ data: user });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданны некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(() => {
      next(new Unauthorized('Неверно указана электронная почта или пороль'));
    });
};
