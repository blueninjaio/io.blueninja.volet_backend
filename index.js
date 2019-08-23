const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require("./config/config");
const routes = require('./routes/routes');
const response_methods = require('./middlewares/response_methods');

const port = process.env.port || config.port;

mongoose.connect(config.mongoose.uri, config.mongoose.options);

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());

app.use(response_methods);
app.use(`/api`, routes);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    return res.internal_server_error(err.message);
});
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
