const path = require('path');
const fs = require('fs');

exports.getData = async (req, res, next) => {
    try {
        const name = req.params.name;
        let filePath;
        if (name === "action") {
            filePath = path.join(__dirname, '..', 'data', 'action.json');
        }
        if (name === "tradetype") {
            filePath = path.join(__dirname, '..', 'data', 'tradetype.json');
        }
        if (name === "session") {
            filePath = path.join(__dirname, '..', 'data', 'session.json');
        }
        if (name === "charttimeframe") {
            filePath = path.join(__dirname, '..', 'data', 'charttimeframe.json');
        }
        if (name === "emotions") {
            filePath = path.join(__dirname, '..', 'data', 'emotions.json');
        }
        if (name === "segment") {
            filePath = path.join(__dirname, '..', 'data', 'segment.json');
        }
        if (name === "brokers") {
            filePath = path.join(__dirname, '..', 'data', 'brokers.json');
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({success:false, msg: 'Internal server error' });
            } else {
                const jsonData = JSON.parse(data);
                const length = jsonData.length;

                console.log("<=========== getData ==== Req ============>")
                console.log(req.params)
                console.log("<=========== getData ==== Req ============>")
                console.log("<=========== getData ==== Res ============>")
                console.log(jsonData)
                console.log("<=========== getData ==== Res ============>")

                res.status(200).json({success:true, length: length, data: jsonData, });
            }
        });




    } catch (err) {
        next(err);
    }
};
