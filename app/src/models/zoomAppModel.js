const mongoose = require('mongoose');

const zoomAppSchema = new mongoose.Schema({
    meetingId: {
        type: Number,
        required: true,
    },
    meetingJWT: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('ZoomAuth', zoomAppSchema);