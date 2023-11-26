const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const { ObjectId } = require('mongoose');
const { profitOrLossForOneTrade } = require('../utils/CustomFunctions'); // Adjust the path based on your project structure

exports.getAllUsersWithPagination = async (req, res, next) => {
    try {

        const page = parseInt(req.params.page) || 1;
        const pageSize = parseInt(req.params.pageSize) || 5;
        const skip = (page - 1) * pageSize;

        let users = await User.find({})
            .skip(skip)
            .limit(pageSize);

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
