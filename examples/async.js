const request = require("request");
const utils = require("../utils");

request(utils.generateUrl("GOOG"), { json: true }, (err, res, body) => {
    console.log("I'm printed after the request finishes");
});
console.log("I'm printed immediately");
