const express = require("express");
const { googleAuth, emailAuthLogin, emailAuthReg, resetPass, sendTempPassViaEmail } = require("../controllers/auth");
const { sendCode, codeCheck } = require("../controllers/sms");
const { userProfileUpdate } = require("../controllers/user");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.route("/google-auth").post(googleAuth);
router.route("/email-auth-reg").post(emailAuthReg);
router.route("/email-auth-login").post(emailAuthLogin);
router.route("/reset-pass").put(resetPass);
router.route("/send-temp-pass").post(sendTempPassViaEmail);



router.route("/otp-send").post(sendCode);
router.route("/otp-verify").post(codeCheck);



router.route("/update-profile").put(userProfileUpdate);




module.exports = router;
