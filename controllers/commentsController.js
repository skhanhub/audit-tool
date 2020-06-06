const db = require("../models");

// Defining methods for the booksController
module.exports = {
  save: function(req, res) {
    console.log("Save comments")
    const filter = {
      env: req.body.env,
      subCategory: req.body.subCategory,
      serverType: req.body.serverType,
    }
    db.Comment
      .findOneAndUpdate(filter, {comments: req.body.comments}, {
        new: true,
        upsert: true // Make this update into an upsert
      })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  find: function(req, res) {
    const filter = {
      env: req.body.env,
      subCategory: req.body.subCategory,
      serverType: req.body.serverType,
    }
    db.Comment
      .findOne(filter)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
