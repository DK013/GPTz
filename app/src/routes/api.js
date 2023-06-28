const express = require('express');
const router = express.Router();

const session = require('../session.js');

const { 
    getMeetingJWT,
    getContext,
    getAuthUrl
} = require('../controller/api');

router.post('/jwt', session, getMeetingJWT);

router.get('/getContext/:id', session, getContext);

router.get('/getAuthUrl', getAuthUrl);

router.get('/log/:msg', (req, res) => {
    const { msg } = req.params;
    console.log(msg);
    res.status(200).json({ msg });
});

module.exports = router;