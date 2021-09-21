const express = require("express");
const volleyball = require("volleyball");
const cors = require("cors");
const mongoose = require('mongoose')
const helmet = require('helmet')

require('dotenv').config();

const middlewares = require('./auth/middlewares')
const auth = require("./auth/index");
const users = require('./api/users')
const notes = require('./api/notes')

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ti7ms.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, () => {
    console.log('connected to db')
});

app.use(volleyball);
app.use(
  cors({
    Origin: "http://localhost:3000/",
  })
);
app.use(express.json());
app.use(helmet())
app.use(middlewares.checkTokenSetUser)

app.use("/auth", auth);
app.use('/api/v1/notes', middlewares.isLoggedIn, notes)
app.use('/api/v1/users', middlewares.isLoggedIn, middlewares.isAdmin, users)


app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨Hello World! 🌈✨🦄",
    user: req.user
  });
});


function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found - " + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Listening on port", port);
});
