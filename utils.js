const config = require("./config");
const request = require("request");
const redis = require("redis");

const client = redis.createClient(config.redisConf);
client.select(0);

const generateUrl = ticker => `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${config.iexPublicKey}`;

const postTickerPrice = (ticker, price) => {
    request.post(
        "http://localhost:4000/api/price",
        {
            json: {
                ticker: ticker,
                price: price
            }
        },
        (err, res, body) => {
            if (res.statusCode == 200) {
                client.get(ticker, (err, val) => {
                    if (val == price) {
                        console.log("Congratulations! You sent the right status code and saved the value into the database :D");
                    } else {
                        console.log("A 200 response was received, but the value in the database isn't correct - either something went wrong or somebody else overwrote your value");
                    }
                });
            } else {
                client.get(ticker, (err, val) => {
                    if (val == price) {
                        console.log(`You saved the correct value into the database but responded with ${res.statusCode} instead of 200 :(`);
                    } else {
                        console.log(`Unfortunately you responded with ${res.statusCode} instead of 200, and didn't save the value into the database :(`);
                    }
                });
            }
        }
    );
};

const getTickerPrice = (ticker, price) => {
    request(`http://localhost:4000/api/price?ticker=${ticker}`, { json: true }, (err, res, body) => {
        if (body.ticker == ticker && body.price == price) {
            console.log("Congratulations! Your get endpoint gave the right answer!");
        } else {
            client.get(ticker, (err, val) => {
                if (val == price) {
                    console.log("The value saved in the database is correct, but your endpoint gave the wrong answer!");
                } else {
                    console.log("Your get endpoint gave the wrong answer, but the data saved in the database isn't correct either");
                }
            });
        }
    });
};

module.exports = { generateUrl };

if (process.argv.length == 5) {
    if (process.argv[2] == "post") {
        postTickerPrice(process.argv[3], parseInt(process.argv[4]));
    } else if (process.argv[2] == "get") {
        ticker = process.argv[3];
        price = parseInt(process.argv[4]);
        postTickerPrice(ticker, price);
        getTickerPrice(ticker, price);
    }
} else {
    console.log("Whoops look like you didn't give the right arguments!");
    console.log("The correct format is: `node utils.js (get|post) <ticker> <price>`");
}
