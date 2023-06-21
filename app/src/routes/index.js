const express = require('express');
const url = require('node:url');
const router = express.Router();
const { handleError, sanitize } = require('../helpers/routing.js');
const { contextHeader, getAppContext } = require('../helpers/cipher.js');
const { getInstallURL } = require('../helpers/zoom-api.js');
const { zoomApp } = require('../config.js');
const session = require('../session.js');

const { appName } = require('../config');

router.get('/', session, (req, res, next) => {
    try {
        sanitize(req);

        const header = req.header(contextHeader);
        
        const isZoom = header && getAppContext(header);
        const context = isZoom ? 'Zoom' : 'Browser';
        
        res.locals.isZoom = isZoom;
        
        return res.render('index', {
            title: appName,
            context: context
        });
    } catch (e) {
        next(handleError(e));
    }
})

router.get('/install', session, async (req, res) => {
    const { url, state, verifier } = getInstallURL();
    req.session.state = state;
    req.session.verifier = verifier;
    res.redirect(url.href);
});

module.exports = router;