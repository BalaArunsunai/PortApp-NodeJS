const express = require('express');
const router = express.Router();
const auth = require('../custom/authenticate').verifyToken;

const load = require("../controllers/loadingController");

router.post(`/loading-data`, load.loading_data);

router.get(`/validate-Loading-Vehicle`, load.validateVehicle);

router.post(`/unloading-vehicle`, load.unloading);

module.exports = router;
