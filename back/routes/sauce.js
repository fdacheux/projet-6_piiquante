const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');


const sauceCtrl = require('../controllers/sauce')

// modèle chemin : router.post('/', auth,  sauceCtrl.createSauce);