const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const helmet = require('helmet')
const { requestLimiter } = require('./middleware/rateLimiter')
require('dotenv').config()

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')

const uri = process.env.MONGO_URI
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

app.use(express.json())
app.use(helmet())
app.disable('x-powered-by')

// Middlewear : CORS (gives access control)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin') //because of helmet, is there another way ?
    next()
})

app.use('/api/sauces', requestLimiter, sauceRoutes)
app.use('/api/auth', requestLimiter, userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
