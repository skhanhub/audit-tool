const db = require("../models");

// Defining methods for the booksController
module.exports = {
  find: function(req, res) {
    console.log("Find Options")
    db.Option
      .findOne()
      .then(dbModel => {console.log(dbModel);res.json(dbModel)})
      .catch(err => res.status(422).json(err));
  },
};
