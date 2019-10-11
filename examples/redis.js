const redis = require("redis");
const config = require("../config");

const client = redis.createClient(config.redisConf);
client.select(0);

client.set("foo", "bar", "EX", 20, redis.print);

client.get("foo", (err, val) => {
    console.log(val);
});
