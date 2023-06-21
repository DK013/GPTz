const express = require('express');
const router = express.Router();

const { 
    getAccessToken,
    getMeetingJWT,
    getMeetingToken,
} = require('../controller');

router.get('/auth/:code', getAccessToken);

router.post('/jwt', getMeetingJWT);

router.post('/token', getMeetingToken);

module.exports = router;