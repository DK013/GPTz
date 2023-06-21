const fetch = require('node-fetch');
const KJUR = require('jsrsasign');
const ZoomAppModel = require('../models/zoomAppModel');
const mongoose = require('mongoose');

const API_URL = 'https://api.zoom.us/v2';

//Get JWT
const getMeetingJWT = (req, res) => {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2

    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
        mn: req.body.meetingId,
        role: req.body.role,
        iat: iat,
        exp: exp,
        appKey: process.env.ZOOM_MEETING_SDK_KEY,
        tokenExp: iat + 60 * 60 * 2
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_MEETING_SDK_SECRET)

    req.session.meetingId = req.body.meetingId;
    req.session.JWT = signature;

    res.json({
        signature: signature
    })
}

//get Context from DB using meeting number
const getContext = async (req, res) => {
    console.log('get context');
    const { id } = req.params;
    console.log(id);

    const context = await ZoomAppModel.find({ meetingId: id});

    if(!context)
        return res.status(404).json({error: "context not found"});
    
    res.status(200).json(context[0]);
}

module.exports = {
    getMeetingJWT,
    getContext
}