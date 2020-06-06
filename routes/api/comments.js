const router = require("express").Router();
const commentController = require("../../controllers/commentsController");

router.route("/")
  .post(commentController.find)

router.route("/save")
  .post(commentController.save)
module.exports = router;
