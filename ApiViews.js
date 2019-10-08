const express = require("express");
const request = require("request");
const redis = require("redis");
const config = require("./config");

// express' router can be used to create views that aren't directly linked to an app
const router = express.Router();

// create a redis client and select the database
const client = redis.createClient(config.redisConf);
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

router.get("/price", (req, res) => {
    // check if the ticker query has been provided
    if (req.query.ticker) {
        let ticker = req.query.ticker.toUpperCase();
        // get the value from the database
        client.get(ticker, (err, val) => {
            // check that there is no error, and that a value was return
            if (!err && val) {
                res.json({
                    ticker: ticker,
                    price: val
                });
            }
            // case when no value was found in the database
            else if (!val) {
                let url = `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${config.iexPublicKey}`;
                // request the stock price from iex
                request(url, { json: true }, (err, result, body) => {
                    // check that there isn't an error and that a latestPrice has been returned
                    if (!err && body.latestPrice) {
                        // set this value in the database and send it to the client
                        client.set(ticker, body.latestPrice, "EX", 120);
                        res.json({
                            ticker: ticker,
                            price: body.latestPrice
                        });
                    } else if (!body.latestPrice) {
                        // if latestPrice doesn't exist - the ticker can't be found
                        // so send a 404 not found http code
                        res.status(404).json({
                            error: "A stock with this ticker does not exist"
                        });
                    } else {
                        console.log(err);
                    }
                });
            }
            // case when a database error took place
            else {
                // send a 500, internal server error status code with an error message
                console.log(err);
                res.status(500).json({
                    error: "Unknown database error"
                });
            }
        });
    } else {
        // throw an http error (400, bad request) if the ticker was not supplied
        res.status(400).json({
            error: "no ticker name supplied"
        });
    }
});

// export the router so that it can be imported in other files
module.exports = router;
