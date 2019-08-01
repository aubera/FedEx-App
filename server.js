'use strict';

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const homeworkRoutes = require('./routes/homework');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const classRoutes = require('./routes/class');
const homeworkRoutes = require('./routes/createhomework');

mongoose.connect(`mongodb+srv://ferrilata:${process.env.MONGO_PASS}@ferrilata-jade-reddit-lrtmg.mongodb.net/FedExDB?retryWrites=true&w=majority`, {useNewUrlParser: true})
  .then(() => {
    console.log('Connection established to DB');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, refreshToken, userId, email"
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  next();
});

app.use(express.json());

app.use('/homework', homeworkRoutes);
app.use('/class', classRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/createhomework', homeworkRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
