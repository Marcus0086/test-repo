const mongoose = require("mongoose");
const {constants} = require("../utils");

module.exports = async () => {
    try {
        // const database = constants.env ? "production" : "testing";
        const database = "testing";
        const uri = `mongodb+srv://engagex:engagex@webrtc.fcp0w.mongodb.net/${database}?retryWrites=true&w=majority`;
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: !constants.env
        };
        await mongoose.connect(uri, connectionParams);
    } catch (err) {
        console.error(err);
    }
};