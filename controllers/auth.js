const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const ejs = require('ejs');
const path = require("path");


exports.googleAuth = async (req, res, next) => {
    try {

        const requiredPath = path.join(__dirname, "../templates/wellcomeEmail.ejs");
        const data = await ejs.renderFile(requiredPath);

        let query = { email: req.body.email };
        let update = req.body;

        let user = await User.findOneAndUpdate(query, update, { upsert: true, new: true, runValidators: true });

        
        sendEmail({
            to: req.body.email,
            subject: "Welcome to the Chartistt Journal",
            text: data,
        }); 

        const result = sendToken(user, 200, res)

        console.log("<=========== googleAuth ==== Req ============>")
        console.log(req.body)
        console.log("<=========== googleAuth ==== Req ============>")
        console.log("<=========== googleAuth ==== Res ============>")
        console.log(result)
        console.log("<=========== googleAuth ==== Res ============>")
        


        // let user = await User.findOne({ "email": req.body.email })
        // if (!user) {
        //     console.log("<=========== Google Register ============>")
        //     user = await User.create(req.body)
           
        //     sendEmail({
        //         to: req.body.email,
        //         subject: "Welcome to the Chartistt Journal",
        //         text: data,
        //     }); 
    
        // } else {
        //     console.log("<=========== Google Login ============>")
        // }

        // const result = sendToken(user, 200, res)

        // console.log("<=========== googleAuth ==== Req ============>")
        // console.log(req.body)
        // console.log("<=========== googleAuth ==== Req ============>")
        // console.log("<=========== googleAuth ==== Res ============>")
        // console.log(result)
        // console.log("<=========== googleAuth ==== Res ============>")

    } catch (err) {
        next(err);
    }
};


exports.emailAuthReg = async (req, res, next) => {
    try {

        const { fullName, email, contact, password } = req.body
        const userExists = await User.findOne({ email })
        const phoneExists = await User.findOne({ contact })

        let msg = "";

        if (userExists && phoneExists) {
            msg = 'Email ID and Phone already registered with us.'
        }else if (userExists) {
            msg = 'Email ID already registered with us.'
        }else if (phoneExists) {
            msg = 'Contact number already registered with us.'
        }

        if(msg.length > 0){
            return res.status(400).json({
                success: false,
                msg: msg,
            })
        }

        // save user object
        const user = await User.create(req.body);

        const requiredPath = path.join(__dirname, "../templates/wellcomeEmail.ejs");
        const data = await ejs.renderFile(requiredPath);

        sendEmail({
            to: email,
            subject: "Welcome to the Chartistt Journal",
            text: data,
        }); 

        const result = sendToken(user, 200, res)

        console.log("<=========== emailAuthReg ==== Req ============>")
        console.log(req.body)
        console.log("<=========== emailAuthReg ==== Req ============>")
        console.log("<=========== emailAuthReg ==== Res ============>")
        console.log(result)
        console.log("<=========== emailAuthReg ==== Res ============>")


    } catch (err) {
        next(err)
    }
};

exports.emailAuthLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'User not found with this email, please register to continue'
            })
        }


        if (user) {

            const temp = await user.matchPassword(password)

            if (!temp) {
                return res.status(401).json({
                    success: false,
                    msg: 'User found with this email but password is not correct, please reset your password'
                })
            }

            const result = sendToken(user, 200, res)

            console.log("<=========== emailAuthLogin ==== Req ============>")
            console.log(req.body)
            console.log("<=========== emailAuthLogin ==== Req ============>")
            console.log("<=========== emailAuthLogin ==== Res ============>")
            console.log(result)
            console.log("<=========== emailAuthLogin ==== Res ============>")

        } else {
            res.status(401).json({
                success: false,
                msg: 'Unauthorized User'
            })
        }

    } catch (err) {
        next(err);
    }
};


exports.resetPass = async (req, res, next) => {
    try {
        const { userId, newPassword } = req.body

        let user = await User.findById(userId)

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'User not found'
            })
        }


        if (user) {

            const temp = await user.matchPassword(newPassword)

            if (temp) {
                return res.status(401).json({
                    success: false,
                    msg: 'Password should not as same as previous'
                })
            } else {
                user.password = newPassword
            }
            user = await user.save()
            const result = sendToken(user, 200, res)

            console.log("<=========== resetPass ==== Req ============>")
            console.log(req.body)
            console.log("<=========== resetPass ==== Req ============>")
            console.log("<=========== resetPass ==== Res ============>")
            console.log(result)
            console.log("<=========== resetPass ==== Res ============>")

        } else {
            res.status(401).json({
                success: false,
                msg: 'Unauthorized User'
            })
        }

    } catch (err) {
        next(err);
    }
};

exports.sendTempPassViaEmail = async (req, res, next) => {
    // Send Email to email provided but first check if user exists
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse("User not found with this email", 404));
        }

        // Create reset url to email to provided email
        const temporaryPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
        // HTML Message

        const requiredPath = path.join(__dirname, "../templates/forgotPass.ejs");
        const data = await ejs.renderFile(requiredPath, {
            temporaryPassword: temporaryPassword,
        });

        sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: data,
        }); 

        user.password = temporaryPassword
        user = await user.save()
        res.status(200).json({ success: true, msg: "Email Sent", data: user.email });

    } catch (err) {
        next(err);
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
