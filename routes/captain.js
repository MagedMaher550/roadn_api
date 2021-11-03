const express=require('express');
const router=express.Router();
const captainController =require('../controllers/captain');

const multer = require("multer");

const upload = multer({
    dest: "uploads",
});

router.post('/register', upload.any('image'), captainController.postRegister);

router.post('/updateCaptain',captainController.updateCaptain);
router.post('/updateCar',captainController.updateCar);
router.post('/updateTrips',captainController.updateTrips);
router.post('/changeCaptainState',captainController.changeCaptainState);
router.post('/login',captainController.postLogin);
router.post('/confirmPayment',captainController.confirmPayment);

router.get("/userIdExist/:id", captainController.userIdExist);
router.get("/trialEnded/:id", captainController.trialEnded);
router.get('/getInfo/:id',captainController.getCaptainData);
router.get('/getInfoWithoutImg/:id',captainController.getCaptainDataWithoutImg);

module.exports = router;