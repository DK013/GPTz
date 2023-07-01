const fetch = require('node-fetch');
const { handleError, sanitize } = require('../helpers/routing');
const { getDeeplink, getToken } = require('../helpers/zoom-api');

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
        req.session.accessToken = accessToken;

        // get password
        const response = await fetch(`https://api.zoom.us/v2/meetings/${req.session.meetingId}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        const meetingContext = await response.json();

        if(response.ok) {
            req.session.password = meetingContext.encrypted_password;
            res.redirect('/meeting');
        } else {
            res.redirect('/?error=true');
        }
        
        // save authtoken in db
        // try {
        //     await ZoomAppModel.create({meetingId: req.session.meetingId, meetingJWT: req.session.JWT, clientId: zoomApp.clientId, accessToken: accessToken});
        // } catch (error) {
        //     next(handleError(error));
        // }
        
        // redirect the user to the Zoom Client
        // const deeplink = await getDeeplink(accessToken);
        // res.redirect(deeplink);
    } catch (e) {
        next(handleError(e));
    }
}

module.exports = { authController };