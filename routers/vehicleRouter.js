const express = require('express');
const router = express.Router();
const auth = require('../custom/authenticate').verifyToken;
const Vehicle = require("../controllers/vehicleController");

router.get('/vehicle-type-auto-complete', Vehicle.vehicle_type_auto_complete);

router.post('/upload-vehicle-details', Vehicle.upload_vehicle_details);

router.get('/get-vehicle-details', auth, Vehicle.get_vehicle_details);

module.exports = router;