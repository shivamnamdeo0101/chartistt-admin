const express = require("express");
const { getData } = require("../controllers/data");
const { addNotification, getAllNotification } = require("../controllers/notification");
const { userProfile, addBroker, updateBroker, deleteBroker, addTrade, updateTrade, deleteTrade, getAllUserTrade, getAllUserBroker, getAllUserTradeCopy, getCalenderTrade } = require("../controllers/user");
const { protect } = require("../middleware/auth");
const router = express.Router();



//Profile
router.route("/profile/:userId").get(protect,userProfile);


//Broker
router.route("/brokers").post(protect,addBroker);
router.route("/brokers").put(protect,updateBroker);
router.route("/brokers").delete(protect,deleteBroker);
router.route("/brokers/:userId").get(protect,getAllUserBroker);

//Trade
router.route("/trades").post(protect,addTrade);
router.route("/trades").put(protect,updateTrade);
router.route("/trades").delete(protect,deleteTrade);
router.route("/trades/:userId/:start/:end").get(protect,getCalenderTrade);
router.route("/trades-filter/:userId/:brokerId/:sortBy/:start/:end").get(protect,getAllUserTradeCopy);


//Notification
router.route("/notifications").post(protect,addNotification);
router.route("/notifications").get(protect,getAllNotification);


//Data
router.route("/data/:name").get(getData);








module.exports = router;

