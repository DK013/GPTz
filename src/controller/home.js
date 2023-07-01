const { handleError, sanitize } = require('../helpers/routing');
const { contextHeader, getAppContext } = require('../helpers/cipher');
const { getInstallURL } = require('../helpers/zoom-api');
const { appName } = require('../config');

//Homepage
const homeController = (req, res, next) => {
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
}

//OAuth flow
const installController = async (req, res) => {
    const { url, state, verifier } = getInstallURL();
    req.session.state = state;
    req.session.verifier = verifier;
    res.redirect(url.href);
}

//Meeting Page
const meetingController = async (req, res) => {
    res.locals.isMeeting = true;
        
    return res.render('index', {
        title: appName,
    });
}

//End Meeting Page
const endController = async (req, res) => {
    req.session = {};
    res.locals.isEnd = true;
    res.render('index', {
        title: appName,
    });
}

module.exports = { homeController, installController, meetingController, endController };