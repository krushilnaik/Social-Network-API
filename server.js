const express = require('express');
const mongoose = require('mongoose');

const app = express();

const {
	parsed: { MONGODB_URI = '', PORT = 8080 }
} = require('dotenv').config();

const routes = require('./routes');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

mongoose.connect(MONGODB_URI || 'mongodb://localhost/social-network');
mongoose.set('debug', true);

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
