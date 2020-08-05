const express = require('express');
const router = express.Router();
const auth = require('../custom/authenticate').verifyToken;

const fuel = require("../controllers/fuelController");

router.get('/vendor_list_autocomplete', fuel.vendor_list_autocomplete);

router.post('/upload-fuel-details', auth, fuel.upload_fuel_details);

module.exports = router;