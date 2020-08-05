const express = require('express');
const router = express.Router();
const multer = require('multer');

const auth = require('../custom/authenticate').verifyToken;
const Images = 'data/images/readingImage';


var imageStorage = function (photosFolder) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, photosFolder);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
};

var imageUpload = function (imagesFolder) {
    return multer({
        storage: imageStorage(imagesFolder)
    });
};


const equipment = require('../controllers/equipmentController');

router.get(`/validate-vehicle`, auth, equipment.validateVehicle);

router.post('/upload-equipment-details', auth, equipment.uploadEquipmentDetails);

router.post('/upload-meter-image', imageUpload(Images).any(), equipment.uploadImage);

router.post('/update-status', imageUpload(Images).any(), equipment.updateStatus);

router.get('/get-status-details', equipment.getStatusDetails);

router.post('/close-status', imageUpload(Images).any(), equipment.closeStatus);

module.exports = router;
