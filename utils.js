const config = require("./config");

const generateUrl = ticker => `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${config.iexPublicKey}`;

module.exports = { generateUrl };
