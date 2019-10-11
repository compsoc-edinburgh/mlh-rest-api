const express = require("express");
const request = require("request");
const redis = require("redis");
const config = require("./config");
const utils = require("./utils");

// express' router can be used to create views that aren't directly linked to an app
const router = express.Router();

let client = redis.createClient(config.redisConf);
client.select(0);

// router.get means this view can be accessed with a GET request
router.get("/", (req, res) => {
    // send the response back to the client
    res.send("<h1>Welcome to CompSoc's node.js tutorial!</h1>");
});

router.get("/current_time", (req, res) => {
    // create a new date object
    const date = new Date();
    // send the object as a json response
    res.json({
        unix_time: date.getTime(),
        iso_string: date.toISOString(),
        date: date.toDateString(),
        timezone_offset: date.getTimezoneOffset()
    });
});

router.get("/teapot", (req, res) => {
    res.sendStatus(418);
});

router.get("/price", (req, res) => {
    // check if the ticker query has been provided
    if (req.query.ticker) {
        let ticker = req.query.ticker.toUpperCase();
    } else {
        // throw an http error (400, bad request) if the ticker was not supplied
        res.status(400).json({
            error: "no ticker name supplied"
        });
    }
});

router.post("/price", (req, res) => {
    // check that request body exists and that the correct values are present
    if (req.body && req.body.ticker && req.body.price) {
        // add your code here
    } else {
        // 400 bad request if the request body did not contain the correct values
        res.status(400).json({
            error: "To add a price you must include both ticker and price in your request body"
        });
    }
});

// export the router so that it can be imported in other files
module.exports = router;
