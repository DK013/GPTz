const axios = require('axios');
const url = require('node:url');
const querystring = require('node:querystring'); 
const { zoomApp } = require('../config.js');
const createError = require('http-errors');
const crypto = require('crypto');

// returns a base64 encoded url
const base64URL = (s) =>
    s
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

// returns a random string of format fmt
const rand = (fmt, depth = 32) => crypto.randomBytes(depth).toString(fmt);

// Get Zoom API URL from Zoom Host value
const host = url.parse(zoomApp.host);
host.hostname = `api.${host.hostname}`;

const baseURL = host.href;

/**
 * Generic function for getting access or refresh tokens
 * @param {string} [id=''] - Username for Basic Auth
 * @param {string} [secret=''] - Password for Basic Auth
 * @param {Object} params - Request parameters (form-urlencoded)
 */
function tokenRequest(params, id = '', secret = '') {
    const username = id || zoomApp.clientId;
    const password = secret || zoomApp.clientSecret;

    return axios({
        data: new URLSearchParams(params).toString(),
        baseURL: zoomApp.host,
        url: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username,
            password,
        },
    }).then(({ data }) => Promise.resolve(data));
}

/**
 * Generic function for making requests to the Zoom API
 * @param {string} method - Request method
 * @param {string | URL} endpoint - Zoom API Endpoint
 * @param {string} token - Access Token
 * @param {object} [data=null] - Request data
 */
function apiRequest(method, endpoint, token, data = null) {
    return axios({
        data,
        method,
        baseURL,
        url: `/v2${endpoint}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(({ data }) => Promise.resolve(data));
}

/**
 * Return the url, state and verifier for the Zoom App Install
 * @return {{verifier: string, state: string, url: module:url.URL}}
 */
function getInstallURL() {
    const state = rand('base64');
    const verifier = rand('ascii');

    const digest = crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64')
        .toString();

    const challenge = base64URL(digest);

    const URL = url.parse(url.resolve(zoomApp.host , `/oauth/authorize?response_type=code&client_id=${zoomApp.clientId}&redirect_uri=${encodeURIComponent(url.resolve(zoomApp.redirectUrl, 'auth'))}&code_challenge=${challenge}&code_challenge_method=S256&state=${state}`));

    return { url: URL, state, verifier };
}

/**
 * Obtains an OAuth access token from Zoom
 * @param {string} code - Authorization code from user authorization
 * @param verifier - code_verifier for PKCE
 * @return {Promise}  Promise resolving to the access token object
 */
async function getToken(code, verifier) {
    if (!code || typeof code !== 'string')
        throw createError(500, 'authorization code must be a valid string');

    if (!verifier || typeof verifier !== 'string')
        throw createError(500, 'code verifier code must be a valid string');

    return tokenRequest({
        code,
        code_verifier: verifier,
        redirect_uri: url.resolve(zoomApp.redirectUrl, 'auth'),
        grant_type: 'authorization_code',
    });
}

/**
 * Obtain a new Access Token from a Zoom Refresh Token
 * @param {string} token - Refresh token to use
 * @return {Promise<void>}
 */
async function refreshToken(token) {
    if (!token || typeof token !== 'string')
        throw createError(500, 'refresh token must be a valid string');

    return tokenRequest({
        refresh_token: token,
        grant_type: 'refresh_token',
    });
}

/**
 * Use the Zoom API to get a Zoom User
 * @param {string} uid - User ID to query on
 * @param {string} token Zoom App Access Token
 */
function getZoomUser(uid, token) {
    return apiRequest('GET', `/users/${uid}`, token);
}

/**
 * Return the DeepLink for opening Zoom
 * @param {string} token - Zoom App Access Token
 * @return {Promise}
 */
function getDeeplink(token) {
    return apiRequest('POST', '/zoomapp/deeplink', token, {
        action: JSON.stringify({
            url: '/',
            role_name: 'Owner',
            verified: 1,
            role_id: 0,
        }),
    }).then((data) => Promise.resolve(data.deeplink));
}

module.exports = { getInstallURL, getToken, refreshToken, getZoomUser, getDeeplink }