const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const { requestLimiter } = require('./middleware/rateLimiter')
require('dotenv').config()

const sauceRoutes = require('./routes/sauce.routes')
const userRoutes = require('./routes/user.routes')

const uri = process.env.MONGO_URI
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(helmet())


// Middlewear : CORS (gives access control)
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
})

app.use('/api/sauces', requestLimiter, sauceRoutes)
app.use('/api/auth', requestLimiter, userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
