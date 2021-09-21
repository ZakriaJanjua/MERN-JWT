const router = require("express").Router();
const User = require("../models/Users");
const joi = require("joi");
const bcrypt = require("bcryptjs");

const schema = joi.object({
  username: joi
    .string()
    .regex(/(^[a-zA-Z0-9_]+$)/)
    .min(2)
    .max(30),
  password: joi.string().trim().min(6),
  role: joi.string().valid("user", "admin"),
  active: joi.bool(),
});

const updateUser = (res, next, query, update) => {
  User.findByIdAndUpdate(query, { $set: update }, { new: true })
    .then((updatedUser) => {
      delete updatedUser._doc.password;
      res.json(updatedUser);
    })
    .catch((err) => next(err));
};

router.get("/", (req, res, next) => {
  User.find({}, "-password")
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id, "-password")
    .then((user) => res.json(user))
    .catch((err) => next(err));
});

router.patch("/:id", (req, res, next) => {
  const { id: _id } = req.params;
  //find user with a given id

  const result = schema.validate(req.body);
  if (!result.error) {
    const query = { _id };
    User.findById(query).then((user) => {
      //if exists: validate req body

      if (user) {
        //if valid: update user in db
        //respond with user
        let update = {
          ...user._doc,
          ...req.body,
        };
        if (req.body.password) {
          bcrypt.hash(req.body.password, 12).then((hashed) => {
            update.password = hashed;
            updateUser(res, next, query, update);
          });
        } else {
          updateUser(res, next, query, update);
        }
      } else {
        //if not valid: send error with a reason
        next();
      }
    });
  } else {
    res.status(422);
    next(result.error);
  }
});

module.exports = router;
