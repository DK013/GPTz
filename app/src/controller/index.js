const fetch = require('node-fetch');
const KJUR = require('jsrsasign');

const API_URL = 'https://api.zoom.us/v2';

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
    const response = await fetch(`${API_URL}/meetings/${req.body.id}/jointoken/local_recording`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${req.body.token}`,
            'Accept': 'application/json'
        }
    });
    const content = await response.json();
    res.status(200).json(content);
};

//Get Metting 
const getAccessToken = async (req, res) => {
    const { code } = req.params;
    var authHeader = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    var data = `code=${encodeURIComponent(code)}&grant_type=${encodeURIComponent('authorization_code')}&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URL)}`;
    const response = await fetch(`https://zoom.us/oauth/token`, {
        method: 'POST',
        headers: { 
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    });
    const content = await response.json();
    res.status(200).json(content);
}


module.exports = {
    getAccessToken,
    getMeetingJWT,
    getMeetingToken
}