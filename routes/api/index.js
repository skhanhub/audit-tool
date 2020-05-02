const router = require("express").Router();
const configRoutes = require("./configs");
const optionRoutes = require("./options");

// Book routes
router.use("/configs", configRoutes);
router.use("/options", optionRoutes);

module.exports = router;
