const router = require("express").Router();
const configRoutes = require("./configs");
const optionRoutes = require("./options");
const commentRoutes = require("./comments");
const searchRoutes = require("./search");

// Book routes
router.use("/configs", configRoutes);
router.use("/options", optionRoutes);
router.use("/comments", commentRoutes);
router.use("/search", searchRoutes);

module.exports = router;
