const db = require("../models");

// Defining methods for the booksController
module.exports = {
  search: function(req, res) {
    const searchTerm = `\"${req.body.search}\"`  
    console.log(`Search ${searchTerm}`)

    db.Config
    // .find({ rawConfig: { $regex: req.body.search, $options: "i" }})
    .find({ $text: { $search: searchTerm} })
    .then(dbModel => {res.json(dbModel)})
    .catch(err => res.status(422).json(err));
  },
};
