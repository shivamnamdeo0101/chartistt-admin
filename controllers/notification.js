const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");
const { sendPushNotification } = require("../utils/sendPushNotification");


exports.addNotification = async (req, res, next) => {
    try {
      
       const notification = await Notification.create(req.body);
        await sendPushNotification(req.body)

        console.log("<=========== addNotification ==== Req ============>")
        console.log(req.body)
        console.log("<=========== addNotification ==== Req ============>")
        console.log("<=========== addNotification ==== Res ============>")
        console.log(notification,{ success: true, message: "Notification added successfully"})
        console.log("<=========== addNotification ==== Res ============>")

        res.status(200).json({ success: true, message: "Notification added successfully", });

        
    } catch (error) {
        next(error)
    }
};
exports.getAllNotification = async (req, res, next) => {
    try {
        let notification = await Notification.find({})
        notification = notification.reverse()
        res.status(200).json({ success: true, length: notification.length, data: notification });

    } catch (error) {
        next(error)
    }
};