const express=require('express');
const router=express.Router();
const userController =require('../controllers/user');

router.get('/getTrips/:from/:to/:next',userController.getTrips);
router.get('/getTrips/:from/:to/:next/:sort',userController.getTripsSorted);
router.get('/captainDetails/:id',userController.captainDetails);

module.exports = router;