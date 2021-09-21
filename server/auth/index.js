const express = require("express");
const joi = require("joi");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const schema = joi.object({
  username: joi
    .string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30)
    .required(),
  password: joi.string().trim().min(6).required(),
});

const respond422 = (res, next) => {
  res.status(422);
  const error = new Error("Unable to Login");
  next(error);
};

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    username: user.username,
    role: user.role,
    active: user.active
  };
  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
    (err, token) => {
      if (err) {
        respond422(res, next);
      } else {
        res.json({
          token,
        });
      }
    }
  );
}

router.get("/", (req, res) => {
  res.json({
    message: "auth folder index",
  });
});

router.post("/signup", (req, res, next) => {
  const result = schema.validate(req.body);

  if (!result.error) {
    //make sure username is unique
    Users.findOne({
      username: req.body.username,
    }).then((user) => {
      //if username is not defined, username not in db, otherwise duplicate username
      if (user) {
        //there is already a user in db with the username
        //respond with error
        const error = new Error("User already present");
        res.status(409);
        next(error);
      } else {
        //hash password
        //insert user
        bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
          const newUser = {
            username: req.body.username,
            password: hashedPassword,
            role: 'user',
            active: true
          };
          Users.create(newUser).then((insertedUser) => {
            createTokenSendResponse(insertedUser, res, next)
          });
        });
      }
    });
  } else {
    res.status(422);
    next(result.error);
  }
});

router.post("/login", (req, res, next) => {
  const result = schema.validate(req.body);

  if (!result.error) {
    Users.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user && user.active) {
        //found the user in the db

        bcrypt.compare(req.body.password, user.password).then((result) => {
          if (result) {
            //recieved the correct password
            createTokenSendResponse(user, res, next)
          } else {
            //recieved the wrong password
            respond422(res, next);
          }
        });
      } else {
        //could not find username in db
        respond422(res, next);
      }
    });
  } else {
    //validation error
    respond422(res, next);
  }
});

module.exports = router;
