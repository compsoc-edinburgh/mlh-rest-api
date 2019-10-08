const express = require("express");
const request = require("request");
const redis = require("redis");
const config = require("./config");

// express' router can be used to create views that aren't directly linked to an app
const router = express.Router();

const client = redis.createClient(config.redisConf);
client.select(0);
const a = client.get("a", (err, res) => {
    return res;
});
console.log(client.get(a));

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
    if (req.query.ticker) {
        let ticker = req.query.ticker.toUpperCase();
        client.get(ticker, (err, val) => {
            if (!err && val) {
                res.json({
                    ticker: ticker,
                    price: val
                });
            } else if (!val) {
                let url = `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${config.iexPublicKey}`;
                request(url, { json: true }, (err, result, body) => {
                    if (!err && body.latestPrice) {
                        client.set(ticker, body.latestPrice, "EX", 120);
                        res.json({
                            ticker: ticker,
                            price: body.latestPrice
                        });
                    } else if (!body.latestPrice) {
                        res.status(404).send("A stock with this ticker does not exist");
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
                res.sendStatus(500);
            }
        });
    } else {
        res.status(400).json({
            error: "no ticker name supplied"
        });
    }
});

// export the router so that it can be imported in other files
module.exports = router;
