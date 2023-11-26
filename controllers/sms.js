const accountSid = 'AC7d300baff32df0178d114c90143836bf';
const authToken = '333c5d301aa0a1f321e74ca59874c356';
const serviceSid  = 'VAb44513b26a377d301429cd54d7854653';



// const accountSid = 'AC281052ee1bc31858bdbc8356f6e6b807';
// const authToken = 'ae132096a3f955341978ba0061ed6192';
// const serviceSid  = 'VA3be65fbef493453e3fa47258356743c1';



const client = require('twilio')(accountSid, authToken);

exports.sendCode = async (req, res, next) => {
    const {to} = req.body;

    console.log(to)
    try {

        const verification = await client.verify.v2.services(serviceSid).verifications.create({
            to: to, // The phone number to verify
            channel: 'sms' // The verification channel (sms, call, or email)
        });
        
        return res.status(200).json({ data: verification });

    } catch (err) {
        next(err)
        res.status(500).json({ message: "Internal server error" });
        
    }
};

exports.codeCheck = async (req, res, next) => {

    const {code,to }= req.body;

    try {

        const verificationCheck = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to: to, // The phone number to verify
            code: code // The verification code entered by the user
        });
        if (verificationCheck.status === 'approved') {
             res.status(200).json({ data: verificationCheck });
        } else {
            res.status(200).json({ message: "Verification code is expired or invalid" });
        }


    } catch (err) {
        next(err);
        res.status(500).json({ message: "Internal server error" });
    }
};