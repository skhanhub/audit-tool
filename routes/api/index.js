const router = require("express").Router();
const configRoutes = require("./configs");
const optionRoutes = require("./options");
const commentRoutes = require("./comments");

// Book routes
router.use("/configs", configRoutes);
router.use("/options", optionRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
