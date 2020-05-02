const db = require("../models");

// Defining methods for the booksController
module.exports = {
  find: function(req, res) {
    db.Option
      .findOne()
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
};
