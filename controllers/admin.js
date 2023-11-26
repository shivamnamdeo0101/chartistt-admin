const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const { ObjectId } = require('mongoose');
const { profitOrLossForOneTrade } = require('../utils/CustomFunctions'); // Adjust the path based on your project structure

exports.getAllUsersWithPagination = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 5; // default to a page size of 10 if not provided

        // Calculate the skip value based on the page number and page size
        const skip = (page - 1) * pageSize;

        // Use the find method with skip and limit for pagination
        let users = await User.find({})

        users = users.map(user => {
            // Calculate total profit or loss for all trades of the user
            const totalProfitOrLoss = user.trades.reduce((sum, trade) => sum + profitOrLossForOneTrade(trade), 0);

            // Determine if the user is in profit or loss
            const isProfit = totalProfitOrLoss >= 0;

            return {
                userId: user._id,
                fullName: user.fullName,
                profitOrLoss: parseFloat(totalProfitOrLoss).toFixed(2),
                isProfit,
                email:user.email,
                avatar:user.avatar
            };
        });

        console.log("<=========== getAllUsersWithPagination ==== Req ============>");
        console.log(req.query); // Log query parameters, including page and pageSize
        console.log("<=========== getAllUsersWithPagination ==== Req ============>");
        console.log("<=========== getAllUsersWithPagination ==== Res ============>");
        console.log({ "users length": users.length, "msg": "Get All Users" });
        console.log("<=========== getAllUsersWithPagination ==== Res ============>",page,pageSize);

        res.status(200).json({ success: true,length:users.length, data: users, msg: "Success" });

    } catch (error) {
        // Handle errors appropriately
        console.error("Error in getAllUsersWithPagination:", error);
        next(error);
    }
};
