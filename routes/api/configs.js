const router = require("express").Router();
const configController = require("../../controllers/configsController");

// Matches with "/api/books"
router.route("/")
  .post(configController.find)

module.exports = router;
