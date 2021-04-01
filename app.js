const express = require("express");
const bodyParser = require("body-parser");


const app = express();
const { API_VERSION } = require('./config');

//Load Routing
const authRoutes = require('./routers/auth');
const UserRoutes = require('./routers/user');
const menuRoutes = require("./routers/menu");
const newsletterRoutes = require("./routers/newsletter");
const productRoutes = require("./routers/product");
const postRoutes = require("./routers/post");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configure Header HTTP
//con esto se soluciona el problema de cors 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Router Basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, UserRoutes);
app.use(`/api/${API_VERSION}`, menuRoutes);
app.use(`/api/${API_VERSION}`, newsletterRoutes);
app.use(`/api/${API_VERSION}`, productRoutes);
app.use(`/api/${API_VERSION}`, postRoutes);


module.exports = app;

