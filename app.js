const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", () => {
  console.log("Yes");
});

app.use((req, res, next) => {
  req.user = {
    _id: "625496422651efc58df9962a", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res) => {
  res.status(404).send({ message: "Запрашиваемая страница отсутсвует" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
