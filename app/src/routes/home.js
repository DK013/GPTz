const express = require('express');
const router = express.Router();
const session = require('../session.js');

const {
    homeController,
    installController
} = require('../controller/home');

router.get('/', session, homeController)

router.get('/install', session, installController);

module.exports = router;