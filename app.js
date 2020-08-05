const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const app = express();
const http = require('http');

const Vehicle = require('./routers/vehicleRouter');
const fuel = require('./routers/fuelRouter');
const admin = require('./routers/adminRouter');
const equipment = require('./routers/equipmentRouter');
const load = require('./routers/loadingRouter');

const config = require("./config");
const accessController = require("./custom/accessControl").accessController;

app.use(compression());
app.use(helmet());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
    bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 1000 })
);

app.use(config.server.api, Vehicle);
app.use(config.server.api, fuel);
app.use(config.server.api, admin);
app.use(config.server.api, equipment);
app.use(config.server.api, load);



app.use(morgan("combined"));
app.use(accessController);

http.createServer(function (req, res) {
    app.handle(req, res);
}).listen(4000);

console.log(`App Started!`);