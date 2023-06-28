const { handleError, sanitize } = require('../helpers/routing');
const { getDeeplink, getToken } = require('../helpers/zoom-api');

const ZoomAppModel = require('../models/zoomAppModel');
const { zoomApp } = require('../config');

const authController = async (req, res, next) => {
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
            await ZoomAppModel.create({meetingId: req.session.meetingId, meetingJWT: req.session.JWT, clientId: zoomApp.clientId, accessToken: accessToken});
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
}

module.exports = { authController };