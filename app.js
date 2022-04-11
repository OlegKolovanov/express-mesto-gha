const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', ()=>{
  console.log('Yes')
});

app.listen(PORT, () => {
 
  console.log(`App listening on port ${PORT}`)
})

