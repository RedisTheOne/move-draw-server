const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 5000;

//Routes
const UsersRoute = require("./routes/users");
const CollectionsRoute = require("./routes/collections");

//MiddleWares
app.use(express.urlencoded({  extended: true  }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});


app.use('/users', UsersRoute);
app.use("/collections", CollectionsRoute);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));