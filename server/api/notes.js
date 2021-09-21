const router = require("express").Router();
const Notes = require("../models/Notes");
const joi = require("joi");

const schema = joi.object({
  title: joi.string().trim().max(100).required(),
  note: joi.string().trim().required(),
});

router.get("/", (req, res) => {
  Notes.find({
    user_id: req.user._id,
  }).then((notes) => {
    res.json(notes);
  });
});

router.post("/", (req, res, next) => {
  const result = schema.validate(req.body);

  if (!result.error) {
    //insert into db
    const note = {
      ...req.body,
      user_id: req.user._id,
    };
    Notes.create(note).then((note) => res.json(note));
  } else {
    const error = new Error(result.error);
    res.status(422);
    next(error);
  }
});

module.exports = router;
