const express = require('express');
const basePath = process.env.APP_BASE_PATH;
module.exports = (cas, s3) => {
    function checkDataManagerGroup(req, res, next) {
        const userInfo = req.session[cas.session_info];

        if (!userInfo || !userInfo.member) {
            return res.status(403).render('error', {
                user: req.session[cas.session_name],
                message: 'Access Denied',
                error: 'User group information not available'
            });
        }

        // Check for exact DataManagers group match
        const isDataManager = userInfo.member.some(group =>
            group.trim() === 'o=DataManagers,o=Staff,ou=Groups,dc=wwarn,dc=org'
        );

        if (!isDataManager) {
            return res.status(403).render('error', {
                user: req.session[cas.session_name],
                message: 'Access Denied',
                error: 'You must be a member of DataManagers group to access this resource'
            });
        }

        next();
    }

    const router = express.Router();



    // Initialize shared utilities

    // Home page (protected by CAS)
    router.get('/', cas.bounce,checkDataManagerGroup, async (req, res) => {
        const user = req.session[cas.session_name];

            res.render('home', { user,  basePath: process.env.APP_BASE_PATH });


    });



    // User info page
    router.get('/userinfo', cas.block, (req, res) => {
        const user = req.session[cas.session_name];
        const info = req.session[cas.session_info];
        res.render('userinfo', {user, info: JSON.stringify(info, null, 2)});
    });


    // Logout
    router.get('/logout', cas.logout);

    // Public page (no auth required)
    router.get('/public', (req, res) => {
        res.render('public');
    });





    return router;
};
