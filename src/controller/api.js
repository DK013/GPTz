const KJUR = require('jsrsasign');
const { zoomApp, redirectUri, appName } = require('../config');

//Get JWT
const getMeetingJWT = (req, res) => {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2

    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: zoomApp.meetingKey,
        mn: req.body.meetingId,
        role: 0,
        iat: iat,
        exp: exp,
        appKey: zoomApp.meetingSecret,
        tokenExp: iat + 60 * 60 * 2
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, zoomApp.meetingSecret)

    req.session.meetingId = req.body.meetingId;
    req.session.JWT = signature;
    if(req.body.password.length > 0)
        req.session.password = req.body.password;

    res.json({
        signature: signature
    })
}

//get Context from session
const getContext = async (req, res) => {

    const context = {
        signature: req.session.JWT,
        key: zoomApp.meetingKey,
        username: appName,
        password: req.session.password,
        meetingId: req.session.meetingId,
        leaveUrl: redirectUri + '/end'
    }
    
    res.status(200).json(context);
}

const getAuthUrl = async (req, res) => {
    res.status(200).json({url: redirectUri});
}

module.exports = {
    getMeetingJWT,
    getContext,
    getAuthUrl
}