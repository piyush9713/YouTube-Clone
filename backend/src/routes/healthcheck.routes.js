const { healthcheck } = require("../controllers/healthcheck.controller.js");
const express = require("express");
const router = express.Router();

router.route("/").get(healthcheck);

module.exports = router;
