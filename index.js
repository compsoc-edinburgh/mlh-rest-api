const express = require("express");
// import the router from the ApiViews file
const ApiViews = require("./ApiViews");

// create a new express app
const app = express();

// apply the router to the app, all of the api urls will be prepended with `/api`
app.use("/api", ApiViews);

// listen for requests on port 4000
app.listen(4000, () => console.log("Congratulations! Your first express app is listening on port 4000!"));
