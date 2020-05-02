const router = require("express").Router();
const optionsController = require("../../controllers/optionsController");

// Matches with "/api/books"
router.route("/")
  .get(optionsController.find)

module.exports = router;
