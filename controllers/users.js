const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundErr('Пользователь не найден, попробуйте еще раз'));
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.find({ email })
    .then((result) => {
      if (result.length === 0) {
        bcrypt.hash(password, 10)
          .then((hash) => {
            User.create({
              name, about, avatar, email, password: hash,
            });
          })
          .then(() => {
            res.status(200).send({
              data: {
                name,
                about,
                avatar,
                email,
              },
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest('Переданны некорректные данные'));
            } else {
              next(err);
            }
          });
      } else {
        next(new Conflict('Такая почта уже зарегистрирована'));
      }
    })
    .catch(next);
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

module.exports.createMe = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные для обновления'));
      } else {
        next(err);
      }
    });
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
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные для обновления аватара'));
      } else {
        next(err);
      }
    });
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundErr(
        'Запрашиваемый пользователь не найден',
      );
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      return res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .json({ message: 'Успешная авторизация' });
    })
    .catch(() => {
      next(new Unauthorized('Неверно указана электронная почта или пaроль'));
    });
};
