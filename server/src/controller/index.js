const fetch = require('node-fetch');
const KJUR = require('jsrsasign');

const API_URL = 'https://api.zoom.us/v2/';

//Get JWT
const getMeetingJWT = (req, res) => {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2

    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
        mn: req.body.meetingNumber,
        role: req.body.role,
        iat: iat,
        exp: exp,
        appKey: process.env.ZOOM_MEETING_SDK_KEY,
        tokenExp: iat + 60 * 60 * 2
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_MEETING_SDK_SECRET)

    res.json({
        signature: signature
    })
}

//Get Metting Token
const getMeetingToken = async (req, res) => {
    const { id } = req.params;
    const response = await fetch(`${API_URL}/meetings/${id}/jointoken/local_recording`);
    const content = await response.json();
    res.status(200).json(content);
};


module.exports = {
    getMeetingJWT,
    getMeetingToken
}