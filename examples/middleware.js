const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./router");

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use("/api", router);

app.listen(4000, () => {
    console.log("Now listening on port 4000!");
});
