const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
require('./db')
const { router } = require('./routes')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use('/.netlify/functions/fleurdle-puzzle/api', router)

module.exports = app