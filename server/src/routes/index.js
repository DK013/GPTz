const express = require('express');
const router = express.Router();

const { 
    getMeetingJWT,
    getMeetingToken,
} = require('../controller');

router.post('/jwt', getMeetingJWT);

router.get('/:id', getMeetingToken);

module.exports = router;