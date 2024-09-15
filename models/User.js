const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { type } = require("os");

const UserRef = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        default: ''
    },
    fullName: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },

    active: {
        type: Boolean,
        default: true
    },

    contact: {
        type: Number,
        default: null,

    },
    joinedOn: {
        type: Number,
        default: Date.now()
    },

    updateOn: {
        type: Number,
        default: Date.now()
    },
    brokers: [{

        brokerName: {
            type: String,
            default: null,
            required: [true, "Please provide brokerName"],
        },
        amtDeposit: {
            type: Number,
            default: 0,
            required: [true, "Please provide deposit amount"],
        },
        updateOn: {
            type: Number,
            default: Date.now()
        },

    }],

    trades: [{

        brokerId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        date: {
            type: Number,
            default: null
        },
        addOn: {
            type: Number,
            default: Date.now()
        },
        updateOn: {
            type: Number,
            default: Date.now()
        },
        tradeName: {
            type: String,
            default: null
        },
        action: {
            type: String,
            default: null
        },
        optionType: {
            type: String,
            default: "call"
        },
        strikePrice: {
            type: Number,
            default: 0
        },

        segment: {
            type: String,
            default: null
        },
        tradeType: {
            type: String,
            default: null
        },
        chartTimeFrame: {
            type: String,
            default: null
        },
        mindSetBeforeTrade: {
            type: String,
            default: null
        },
        mindSetAfterTrade: {
            type: String,
            default: null
        },
        session: {
            type: String,
            default: null
        },
        quantity: {
            type: Number,
            default: null
        },
        entryPrice: {
            type: Number,
            default: null
        },
        exitPrice: {
            type: Number,
            default: null
        },
        stopLoss: {
            type: Number,
            default: null
        },
        targetPoint: {
            type: Number,
            default: null
        },
        entryNote: {
            type: String,
            default: null
        },
        exitNote: {
            type: String,
            default: null
        }

    }],

});

// Custom validation to check for unique brokerName within the brokers array
UserRef.path("brokers").validate(async function (value) {
    // Extract the broker names from the array
    const brokerNames = value.map((broker) => broker.brokerName);

    // Check if there are duplicate broker names
    if (new Set(brokerNames).size !== brokerNames.length) {
        throw new Error("Each brokerName in the brokers array must be unique.");
    }
}, "Each brokerName in the brokers array must be unique.");

UserRef.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

UserRef.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserRef.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Create a partial index that enforces uniqueness only for non-null values
UserRef.index({ contact: 1 }, { unique: true, partialFilterExpression: { contact: { $ne: null } } });
UserRef.index({ 'brokers.brokerName': 1 }, { unique: true, partialFilterExpression: { 'brokers.brokerName': { $ne: null } } });

const User = mongoose.model("User", UserRef);

module.exports = User;