const Card = require('../models/card');

module.exports.getCard = (req, res)=>{
  Card.find({})
  .then(cards => res.send({data: cards}))
  .catch(()=> res.status(500).send({message: 'Произошла ошибка'}))
}

module.exports.createCard = (req, res)=>{
  Card.create({name, link})
  .then((card) => res.send({ data: card }))
  .catch((err) => (err.name === 'ValidationError'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
}

module.exports.deleteCard = (req, res)=>{
  Card.findByIdAndRemove(req.params.id)
  .then((card) => ((!card)
      ? res.status(404).send({ message: 'Карта не найдена' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'SomeErr'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Карта не найдена' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'SomeErr'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Карта не найдена' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'SomeErr'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
};