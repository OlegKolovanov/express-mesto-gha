const User = require('../models/user')


module.exports.getUsers = (req, res) => {
  User.find({})
  .then(users => res.send({data: users}))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getId = (req, res) => {
  User.findById(req.params._id)
  .then((user) => ((!user)
      ? res.status(404).send({ message: 'Пользователь не найден' })
      : res.send({ data: user })))

    .catch((err) => ((err.name === 'SomeErr')
      ? res.status(400).send({ message: 'Переданны некорректные данные для поиска' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
}

module.exports.createUsers = (req, res) => {
  const {name, about, avatar} = req.body
  User.create({name, about, avatar})
  .then((user) => res.send({ data: user }))
    .catch((err) => ((err.name === 'ValidationError')
      ? res.status(400).send({ message: 'Переданны некорректные данные для создания профиля' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
}

module.exports.createMe = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { name, about })
  .then((user) => ((!user)
  ? res.status(404).send({ message: 'Пользователь не найден' })
  : res.send({ data: user })))
.catch((err) => ((err.name === 'ValidationError')
  ? res.status(400).send({ message: 'Переданны некорректные данные для редактирования профиля' })
  : res.status(500).send({ message: 'Ошибка сервера' })));
};

module.exports.createUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.params.id, { avatar }, { new: true })
  .then((user) => ((!user)
  ? res.status(404).send({ message: 'Пользователь не найден' })
  : res.send({ data: user })))
.catch((err) => ((err.name === 'ValidationError')
  ? res.status(400).send({ message: 'Переданны некорректные данные для смены аватара' })
  : res.status(500).send({ message: 'Ошибка сервера' })));
};