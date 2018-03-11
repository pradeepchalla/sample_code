var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');
var path = require('path');
var request = require('request');
var mongoDB = require("mongodb");
var mongoose = require('mongoose');


var transporter =nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
});


var app = express();

app.use(busboy());
app.use(cors({ origin: '*' }));

app.get('/', function (req, res) {
    res.send('Connected!!!');
});

var logger = function (req, res, next) {
    next();
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json())
app.use(busboyBodyParser());
app.use(passport.initialize());


require('./frontend_app/config/passport')(passport);
var apiRoutes = express.Router();
var verkaufsRoutes = express.Router();
var verkaufsEinstellungenRoutes = express.Router();
var verkaufsSpcRoutes = express.Router();
var adminstrationRoutes = express.Router();
var verkaufsDeliveryzonesRoutes = express.Router();
var unternehmenRoutes = express.Router();

apiRoutes.post('/authenticate', function (req, res) {
    mongoClient.connect(config.database, function (err, db) {
        db.collection("aupris_credentials").findOne({ 'eMail': req.body.eMail }, function (err, user) {

            if (!user || err) {
                res.send({ success: false, msg: 'Authentication failed. User not found. or server down', errkind: 'wronguser' });
            } else {
                // check if password matches
                User.comparePassword(req.body.Passwort, user.Password, function (err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var difference = new Date() - new Date(user.LastActiveTime);
                        if (difference > 60e3 || (isNaN(difference)) || req.body.forcelogin) {
                            if (Math.floor(difference / 60e3) >= 5 || (isNaN(difference)) || req.body.forcelogin) {
                                db.collection("aupris_credentials").findAndModify(
                                    { 'eMail': req.body.eMail },
                                    [],
                                    { $set: { 'Token': new Date(), 'LastActiveTime': new Date() } },
                                    { new: true },
                                    function (err, data) {
                                        var token = jwt.encode(data.value, config.secret);
                                        res.json({ success: true, token: 'JWT ' + token });
                                        res.end();
                                        db.close();

                                    });

                            }
                            else {
                                res.send({ success: false, msg: 'multi log in', errkind: 'multilogin' });
                                db.close();
                            }

                        }
                        else {
                            res.send({ success: false, msg: 'multi log in', errkind: 'multilogin' });
                            db.close();
                        }

                        // return the information including token as JSON
                    } else {
                        res.send({ success: false, msg: 'Authentication failed. Wrong password.', errkind: 'wrongpass' });
                        db.close();
                    }
                });
            }

        });


    });
});

apiRoutes.get('/logout_auth', function (req, res) {
    mongoClient.connect(config.database, function (err, db) {
        var token = getToken(req.headers);
        var decoded = jwt.decode(token, config.secret);
                db.collection("aupris_credentials").findAndModify(
                    { 'eMail': decoded.eMail },
                    [],
                    { $set: { 'Token': "", 'LastActiveTime': "" } },
                    { new: true },
                    function (err, data) {
                        res.json({ success: true, msg: 'user logged out' });
                        res.end();
                        db.close();
                    });
    });

}); 


apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), function (req, res) {
    mongoClient.connect(config.database, function (err, db) {

        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            db.collection("aupris_credentials").findOne({
                'eMail': decoded.eMail
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
                } else {
                    res.json({ success: true, userdata: user });
                    res.end();
                    db.close();
                }
            });
        }
        else {
            res.status(403).send({ success: false, msg: 'No token provided.', errkind: 'notoken' });
            res.end();
            db.close();
        }
    });

});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};



    