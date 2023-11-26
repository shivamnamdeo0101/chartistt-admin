const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const { ObjectId } = require('mongoose');

exports.userProfile = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.userId)

        const result = sendToken(user, 200, res)

        console.log("<=========== userProfile ==== Req ============>")
        console.log(req.params)
        console.log("<=========== userProfile ==== Req ============>")
        console.log("<=========== userProfile ==== Res ============>")
        console.log(result)
        console.log("<=========== userProfile ==== Res ============>")
    } catch (err) {
        next(err);
    }
};



exports.userProfileUpdate = async (req, res, next) => {

    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);

        const { fullName, email, contact } = req.body

        const fields=["fullname","email","contact"]

        const profile = await User.findById(req.body.userId)
        let updatedProfile = {}


        fields.forEach((item)=>{
            if(req.body[item] != profile[item]){
                updatedProfile[item] = req.body[item]
            }
        })

        console.log(updatedProfile)

       // return res.status(200).json({ success: true,data:updatedProfile});
       let msg = "";
       let userExists,phoneExists;
        if(updatedProfile.hasOwnProperty("email")){
            userExists = await User.findOne({ email })
        }
        if(updatedProfile.hasOwnProperty("contact")){
            phoneExists = await User.findOne({ contact })
        }

    
        if (userExists && phoneExists) {
            msg = 'Email ID and Phone already registered with us.'
        } else if (userExists) {
            msg = 'Email ID already registered with us.'
        } else if (phoneExists) {
            msg = 'Contact number already registered with us.'
        }

        if (msg.length > 0) {
            return res.status(400).json({
                success: false,
                msg: msg,
            })
        }

        let user = await User.findOneAndUpdate({ _id: userId }, { ...req.body, updateOn: Date.now() }, { new: true })
        const result = sendToken(user, 200, res)

        console.log("<=========== userProfileUpdate ==== Req ============>")
        console.log(req.body)
        console.log("<=========== userProfileUpdate ==== Req ============>")
        console.log("<=========== userProfileUpdate ==== Res ============>")
        console.log(result)
        console.log("<=========== userProfileUpdate ==== Res ============>")

    } catch (error) {
        next(error);
    }
};





exports.addBroker = async (req, res, next) => {
    try {
        let user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const broker = req.body;
        if (!broker) {
            return res.status(400).json({ success: false, msg: "Missing broker parameter" });
        }

        const already = JSON.stringify(user.brokers).includes(req.body.brokerName)

        if (already) {
            return res.status(400).json({ success: false, msg: "Broker Already Added" });
        }

        user.brokers.push(broker);
        const result = await user.save();

        console.log("<=========== addBroker ==== Req ============>")
        console.log(req.body)
        console.log("<=========== addBroker ==== Req ============>")
        console.log("<=========== addBroker ==== Res ============>")
        console.log({ result, msg: "Broker added successfully" })
        console.log("<=========== addBroker ==== Res ============>")

        res.status(200).json({ success: true, data: result.brokers, msg: "Broker added successfully" });

    } catch (error) {
        next(error);
    }
};

exports.updateBroker = async (req, res, next) => {

    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        const brokerId = new mongoose.Types.ObjectId(req.body.broker.brokerId);
        const updatedBrokerData = req.body.broker; // Updated broker data sent in the request body

        const brokerFieldsToUpdate = {
            ...updatedBrokerData,
            _id: brokerId, // Ensure that the _id remains the same
        };

        const result = await User.updateOne(
            { _id: userId, 'brokers._id': brokerId }, // Find the user and the specific broker
            { $set: { 'brokers.$': brokerFieldsToUpdate } }, // Update the specific broker
            { new: true } // Return the updated user document
        );



        if (!result) {
            return res.status(404).json({ error: 'User or Broker not found' });
        }

        console.log("<=========== updateBroker ==== Req ============>")
        console.log(req.body)
        console.log("<=========== updateBroker ==== Req ============>")
        console.log("<=========== updateBroker ==== Res ============>")
        console.log({ data: result, msg: "Broker Updated successfully" })
        console.log("<=========== updateBroker ==== Res ============>")

        return res.status(200).json({ success: true, data: result, msg: "Broker Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

};


exports.deleteBroker = async (req, res, next) => {

    try {
        var brokerId = req.body.brokerId;
        var userId = req.body.userId;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, msg: "user not found" });
        }

        user = await User.updateOne(
            { _id: userId },
            { $pull: { brokers: { _id: brokerId } } },
        )

        user = await User.updateOne(
            { _id: userId },
            { $pull: { trades: { brokerId: brokerId } } },
        )

        console.log("<=========== deleteBroker ==== Req ============>")
        console.log(req.body)
        console.log("<=========== deleteBroker ==== Req ============>")
        console.log("<=========== deleteBroker ==== Res ============>")
        console.log({ data: req.body, msg: "Broker Deleted successfully" })
        console.log("<=========== deleteBroker ==== Res ============>")

        return res.status(200).json({ success: true, msg: "Broker Deleted" });
    } catch (error) {
        next(error);
    }
};



//Trade................


exports.addTrade = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const trade = req.body.trade;
        if (!trade) {
            return res.status(400).json({ success: false, msg: "Missing trade parameter" });
        }
        user.trades.push(trade);
        const result = await user.save();

        console.log("<=========== addTrade ==== Req ============>")
        console.log(req.body)
        console.log("<=========== addTrade ==== Req ============>")
        console.log("<=========== addTrade ==== Res ============>")
        console.log({ data: req.body, msg: "Trade Deleted successfully" })
        console.log("<=========== addTrade ==== Res ============>")

        res.status(200).json({ success: true, data: result.trades, msg: "Trade added successfully" });

    } catch (error) {
        next(error);
    }
};

exports.updateTrade = async (req, res, next) => {

    try {
        var tradeId = req.body.tradeId;
        var userId = new mongoose.Types.ObjectId(req.body.userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "user not found" });
        }
        const newBrokerObject = req.body.trade;

        let tradeList = user.trades;

        const tradeIndex = tradeList.findIndex(
            (t) => t._id == tradeId
        );

        tradeList[tradeIndex] = { _id: tradeId, ...newBrokerObject };

        user.trades = tradeList;

        const result = await user.save();

        console.log("<=========== updateTrade ==== Req ============>")
        console.log(req.body)
        console.log("<=========== updateTrade ==== Req ============>")
        console.log("<=========== updateTrade ==== Res ============>")
        console.log({ data: req.body, msg: "Trade Updated successfully" })
        console.log("<=========== updateTrade ==== Res ============>")

        return res.status(200).json({ success: true, data: req.body, msg: "Trade Updated" });
    } catch (error) {
        next(error);
    }


};

exports.deleteTrade = async (req, res, next) => {

    try {

        var tradeId = req.body.tradeId;
        var userId = new mongoose.Types.ObjectId(req.body.userId);
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, msg: "user not found" });
        }

        user = await User.updateOne(
            { _id: userId },
            { $pull: { trades: { _id: tradeId } } },
        )

        console.log("<=========== deleteTrade ==== Req ============>")
        console.log(req.body)
        console.log("<=========== deleteTrade ==== Req ============>")
        console.log("<=========== deleteTrade ==== Res ============>")
        console.log({ data: req.body, msg: "Trade Deleted successfully" })
        console.log("<=========== deleteTrade ==== Res ============>")

        return res.status(200).json({ success: true, data: req.body, msg: "trade deleted" });
    } catch (error) {
        next(error);
    }


};



//Broker................
exports.getAllUserBroker = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        const brokers = user.brokers;
        // Create an array to store broker data along with their trades
        const brokersWithTrades = [];
        // Iterate through each broker
        brokers.map((broker) => {
            // Find trades associated with the broker
            const trades = user.trades.filter((trade) =>
                trade.brokerId.equals(broker._id));
            // Add the broker data along with its trades to the result array
            brokersWithTrades.push({
                broker,
                trades,
            });
        })

        
        // Sort the filtered trades in descending order based on updateOn, date, or addOn
        brokersWithTrades.sort((a, b) => {
            return b.broker.updateOn - a.broker.updateOn;
        });

        console.log("<=========== getAllUserBroker ==== Req ============>")
        console.log(req.params.userId, "User All Brokers")
        console.log("<=========== getAllUserBroker ==== Req ============>")
        console.log("<=========== getAllUserBroker ==== Res ============>")
        console.log({ data: user.brokers, msg: "User All Brokers" })
        console.log("<=========== getAllUserBroker ==== Res ============>")

        res.status(200).json({ success: true, length: brokersWithTrades.length, data: brokersWithTrades });
    } catch (error) {
        next(error);
    }
};

exports.getAllUserTrade = async (req, res, next) => {
    try {

        //filterType = t=>today, w=>week, m=>month, y=>year, a=>all
        //sortBy u=>updateOn , a=>addOn , d=>date


        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const filterType = req.params.filterType
        const sortBy = req.params.sortBy

        let list = user.trades;

        list = list.map(trade => {
            const broker = user.brokers.filter(b => b._id.equals(trade.brokerId));
            return {
                broker: broker ? broker : '',
                trade,
            };

        });


        const today = Date.now();
        const currentTime = Date.now();
        const oneDayMillis = 24 * 60 * 60 * 1000;
        const oneMonthMillis = 30 * oneDayMillis;
        const oneWeekMillis = 7 * oneDayMillis;
        const oneYearMillis = (30 * oneDayMillis) * 12;


        if (filterType != 'a') {
            list = list.filter((obj) => {

                let tradeTimestamp;

                if (sortBy === "u") {
                    tradeTimestamp = parseInt(obj.trade.updateOn)
                } else if (sortBy === "a") {
                    tradeTimestamp = parseInt(obj.trade.addOn)
                } else {
                    tradeTimestamp = parseInt(obj.trade.date)
                }

                // const tradeTimestamp = parseInt(trade.updateOn || trade.date || trade.addOn);

                if (filterType === "t" && currentTime - tradeTimestamp <= oneDayMillis) {
                    return true;
                }
                if (filterType === "m" && currentTime - tradeTimestamp <= oneMonthMillis) {
                    return true;
                }
                if (filterType === "w" && currentTime - tradeTimestamp <= oneWeekMillis) {
                    return true;
                }
                if (filterType === "y" && currentTime - tradeTimestamp <= oneYearMillis) {
                    return true;
                }
                return false;
            });

        }

        // Sort the filtered trades in descending order based on updateOn, date, or addOn
        list.sort((a, b) => {
            if (sortBy === 'u') {
                return b.trade.updateOn - a.trade.updateOn;
            }
            if (sortBy === 'a') {
                return b.trade.addOn - a.trade.addOn;
            }
            if (sortBy === 'd') {
                return b.trade.date - a.trade.date;
            }
        });

        console.log("<=========== getAllUserTrade ==== Req ============>")
        console.log(req.params)
        console.log("<=========== getAllUserTrade ==== Req ============>")
        console.log("<=========== getAllUserTrade ==== Res ============>")
        console.log(list)
        console.log("<=========== getAllUserTrade ==== Res ============>")

        return res.status(200).json({ success: true, length: list.length, data: list });

    } catch (error) {
        next(error);
    }
};


exports.getAllUserTradeCopy = async (req, res, next) => {

    try {

        const userId = req.params.userId;
        const user = await User.findById(userId);
        

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const sortBy = req.params.sortBy
        const brokerId = req.params.brokerId;
        const start = req.params.start;
        const end = req.params.end;
        const trades = user.trades;
        // Create an array to store broker data along with their trades
        let list = [];
        // Iterate through each broker
        trades.map((trade) => {
            // Find trades associated with the broker
            const broker = user.brokers.filter((broker) =>
                trade.brokerId.equals(broker._id));
            // Add the broker data along with its trades to the result array
            list.push({
                broker: broker && broker[0],
                trade: trade
            });
        })

        if(brokerId!=-1){
            list = list.filter((trade) => trade.trade.brokerId.equals(brokerId));
        }
        list = list.filter((item) => {
            const tradeTimestamp = item.trade.date;
            return tradeTimestamp >= start && tradeTimestamp <= end;
        });
        list.sort((a, b) => {
            const fieldA = a.trade[sortBy];
            const fieldB = b.trade[sortBy];

            if (fieldA > fieldB) {
                return -1; // Swap for descending order
            }
            if (fieldA < fieldB) {
                return 1; // Swap for descending order
            }
            return 0;
        });

        console.log("<=========== getAllUserTrade ==== Req ============>")
        console.log(req.params)
        console.log("<=========== getAllUserTrade ==== Req ============>")
        console.log("<=========== getAllUserTrade ==== Res ============>")
        console.log(list)
        console.log("<=========== getAllUserTrade ==== Res ============>")

        return res.status(200).json({ success: true, length: list.length, data: list });

    } catch (error) {
        next(error);
    }
};



const sendToken = (user, statusCode, res) => {
    const temp = {
        success: true,
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            active: user.active,
            contact: user.contact,
            joinedOn: user.joinedOn,
            addedAt: user.addedAt,
            updatedAt: user.updatedAt,
            token: user.getSignedJwtToken(),
        }
    }

    res.status(statusCode).json(temp);

    return temp;
};


exports.getCalenderTrade = async (req, res, next) => {

    try {

        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const sortBy = "date";
        const start = req.params.start;
        const end = req.params.end;

        const trades = user.trades;
        // Create an array to store broker data along with their trades
        let list = [];
        // Iterate through each broker
        trades.map((trade) => {
            // Find trades associated with the broker
            const broker = user.brokers.filter((broker) =>
                trade.brokerId.equals(broker._id));
            // Add the broker data along with its trades to the result array
            list.push({
                broker: broker && broker[0],
                trade: trade
            });
        })

        list = list.filter((trade) => {
            const tradeTimestamp = trade.trade.date;
            return tradeTimestamp >= start && tradeTimestamp <= end;
        });

        list.sort((a, b) => {
            const fieldA = a.trade[sortBy];
            const fieldB = b.trade[sortBy];

            if (fieldA < fieldB) {
                return -1; // Swap for descending order
            }
            if (fieldA > fieldB) {
                return 1; // Swap for descending order
            }
            return 0;
        });


        console.log("<=========== getCalenderTrade ==== Req ============>")
        console.log(req.params)
        console.log("<=========== getCalenderTrade ==== Req ============>")
        console.log("<=========== getCalenderTrade ==== Res ============>")
        console.log(list)
        console.log("<=========== getCalenderTrade ==== Res ============>")

        return res.status(200).json({ success: true, length: list.length, data: list });

    } catch (error) {
        next(error);
    }
};


