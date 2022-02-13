import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import './db'
import { router } from './routes'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use('/.netlify/functions/fleurdle-puzzle/api', router)

export default app