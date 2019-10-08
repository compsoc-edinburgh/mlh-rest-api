const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
// import the router from the ApiViews file
const ApiViews = require("./ApiViews");

// create a new express app
const app = express();

// this middleware allows for logging of requests
app.use(morgan("combined"));
// this middleware is necessary to access the request body of post requests
app.use(bodyParser.json());
// apply the router to the app, all of the api urls will be prepended with `/api`
app.use("/api", ApiViews);

// listen for requests on port 4000
app.listen(4000, () => console.log("Congratulations! Your first express app is listening on port 4000!"));
