const express = require('express');
const router = express.Router();
const { query } = require('express-validator');

const { handleError, sanitize } = require('../helpers/routing.js');
const { getDeeplink, getToken } = require('../helpers/zoom-api.js');

const session = require('../session.js');

const ZoomAppModel = require('../models/zoomAppModel');
const { zoomApp } = require('../config.js');

const codeMin = 32;
const codeMax = 64;

const validateQuery = [
    query('code')
        .isString()
        .withMessage('code must be a string')
        .isLength({ min: codeMin, max: codeMax })
        .withMessage(`code must be > ${codeMin} and < ${codeMax} chars`)
        .escape(),
    query('state')
        .isString()
        .withMessage('state must be a string')
        .custom((value, { req }) => value === req.query.state)
        .withMessage('invalid state parameter')
        .escape(),
];

router.get('/', session, validateQuery, async (req, res, next) => {
    req.session.state = null;

    try {
        // sanitize code and state query parameters
        sanitize(req);
        
        const code = req.query.code;
        
        const verifier = req.session.verifier;
        req.session.verifier = null;
        
        // // get Access Token from Zoom
        const { access_token: accessToken } = await getToken(code, verifier);
        
        // save authtoken in db
        try {
            const appdata = await ZoomAppModel.create({meetingId: req.session.meetingId, meetingJWT: req.session.JWT, clientId: zoomApp.clientId, accessToken: req.session.accessToken});
        } catch (error) {
            next(handleError(error));
        }
        
        // fetch deeplink from Zoom API
        const deeplink = await getDeeplink(accessToken);

        // redirect the user to the Zoom Client
        res.redirect(deeplink);
    } catch (e) {
        next(handleError(e));
    }
});

module.exports = router;