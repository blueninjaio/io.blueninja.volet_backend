const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require("./config/config");
const routes = require('./routes/routes');

const port = process.env.port || config.port;

mongoose.connect(config.mongoose.uri, config.mongoose.options);

app.set('port', port);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());

app.use(`/api`, routes);
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
