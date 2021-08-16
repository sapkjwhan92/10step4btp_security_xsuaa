'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const xssec = require('@sap/xssec');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const xsenv = require('@sap/xsenv');

const dbOp = require('./db-op');

function log(logTxt) {
    console.log(logTxt);
}

function getJWT(req) {
    var jwt = req.header('authorization');
    if (!jwt) {
        log('No JWT in Request - Call performed directly to App');
        return null;
    }
    return jwt.substring('Bearer '.length);
}

function logJWT(req) {
    var jwt = getJWT(req);
    if (jwt) {
        log('JWT: ' + jwt);
    }
    if (req.authInfo) {
        log('Grant type: ' + req.authInfo.getGrantType());
    }
    if (req.user) {
        log('User: ' + JSON.stringify(req.user));
    }
}

function sendForbiddenResponse(res) {
	log('Missing required scope');
    res.status(403).end('Forbidden');
}

const url = '/users';

const app = express();
app.use(bodyParser.json());

passport.use(new JWTStrategy(xsenv.getServices({uaa:{tag:'xsuaa'}}).uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get(url, function (req, res) {
    logJWT(req);
    if (!req.authInfo.checkLocalScope('Display')) {
	    return sendForbiddenResponse(res);
	}
    dbOp.getAll(res);
});

app.post(url, function (req, res) {
    logJWT(req);
    if (!req.authInfo.checkLocalScope('Update')) {
	    return sendForbiddenResponse(res);
	}
    dbOp.insertOne(res, req.body, req.user.id);
});

app.delete(url + '/:id', function (req, res) {
	logJWT(req);
	if (!req.authInfo.checkLocalScope('Update')) {
	    return sendForbiddenResponse(res);
	}
    dbOp.deleteOne(res, req.params.id);
});

app.get("/currentUser", function (req, res) {
    logJWT(req);
    var data = {
        "givenName": req.user.name.givenName,
        "employeeNumber": req.authInfo.getAttribute("EmployeeNumber")
    }
    res.status(200).json(data);
});

var PORT = process.env.PORT || 8088;
var server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    log('Demo app listening at http://' + host + ':' + port);
});