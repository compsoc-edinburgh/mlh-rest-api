const express = require("express");
const redis = require("redis");
const config = require("./config");

// express' router can be used to create views that aren't directly linked to an app
const router = express.Router();

const client = redis.createClient(config.redisConf);
client.select(1);
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

// export the router so that it can be imported in other files
module.exports = router;
