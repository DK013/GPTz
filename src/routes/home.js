const express = require('express');
const router = express.Router();
const session = require('../session.js');

const {
    homeController,
    installController,
    meetingController,
    endController
} = require('../controller/home');

router.get('/', session, homeController);

router.get('/install', session, installController);

router.get('/meeting', session, meetingController);

router.get('/end', session, endController);

module.exports = router;