const utils = require("../utils");
const request = require("request");

request(utils.generateUrl("GOOG"), { json: true }, (err, result, body) => {
    if (!err) {
        console.log(body);
    } else {
        console.log(err);
    }
});
