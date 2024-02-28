const express = require('express');
const loader = require('../src/loaders/index');

const PORT = 5001;

const app = express()

loader(app)

module.exports = app

