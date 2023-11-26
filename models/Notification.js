const mongoose = require("mongoose");

const getTime = () => {
    // Get the current time in India (IST)
    // const current_time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    // const date = new Date(current_time);
    // const timestamp = date.getTime();
    // console.log(date)
    return Date.now()
   // return new Date(current_time).getTime(); // Return the Unix timestamp
}

const NotificationRef = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please provide text"],
    },
    title: {
        type: String,
        required: [true, "Please provide title"],
    },
    linkUrl: {
        type: String,
        required: [true, "Please provide linkUrl"],
    },
    linkTitle: {
        type: String,
        required: [true, "Please provide linkTitle"],
    },
    timestamp: {
        type: Number,
        default: getTime()
    },

});


const Notification = mongoose.model("Notification", NotificationRef);

module.exports = Notification;