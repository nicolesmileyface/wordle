const sls = require('serverless-http')
const app = require('./app')
exports.handler = sls(app);