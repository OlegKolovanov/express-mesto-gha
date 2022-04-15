const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mestodb', ()=>{
  console.log('Yes')
});

app.use((req, res, next) => {
  req.user = {
    _id: '62596a55d9a8e4f9ad478d6e' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница отсутсвует' });
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
};

app.listen(PORT, () => {

  console.log(`App listening on port ${PORT}`)
})

