const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cookieParser = require("cookie-parser");
const { request } = require("http");
const { Socket } = require("dgram");
const LogicServer = require("./logic/server-logic");

const app = express();

const host = '0.0.0.0';
const port = 7000;

var sessionMiddleware = session({
    secret: "secret"
});

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(sessionMiddleware);

app.locals.logicServer = new LogicServer();

app.get('/', (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    let logicServer = app.locals.logicServer;
    if (req.body.username) {
        let newUserName = req.body.username;
        console.log("Register user: ", newUserName);
        logicServer.addPlayer(req.sessionID, newUserName);
        
        res.redirect("/index");
    }
});

app.get('/index', (req, res) => {
    res.render("index");
});


app.post("/sendMessage", (req, res) => {
    let logicServer = app.locals.logicServer;
    if (req.body.message) {
        let message = req.body.message;
        console.log("Message received ", message);
        if (logicServer.hasplayer(req.sessionID)) {
            logicServer.getMessage(req.sessionID, message);
        }
    }
});


server = app.listen(port, host, function() {
    console.log(`Server listens http://${host}:${port}`);

});

const socketIO = require("socket.io")(server);
// var socketIO = socketIO.listen(server);

socketIO.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


socketIO.on("connection", socket => {
    socket.request.session;
    if (app.locals.logicServer.hasplayer(socket.request.sessionID)
        && !app.locals.logicServer.players.get(socket.request.sessionID).isAlive) {
        app.locals.logicServer.linkSocketToPlayer(socket.request.sessionID, socket);
    } else {
        app.locals.logicServer.linkSocketToPlayer(socket.request.sessionID, socket);
    }

    // socket.on("disconnect", (reason) => {
    //     if (app.locals.logicServer.hasplayer(socket.request.sessionID)) {
    //         app.locals.logicServer.players.get(socket.request.sessionID).waitReconnect(socket.request.session);
    //     }
    //     // app.locals.logicServer.disconnect(socket.request.sessionID);
    //     // socket.request.session.destroy();
    // });

    // socket.on("block", (data) => {
    //     app.locals.logicServer.boxId(data.blockNum, socket.request.sessionID);
    // });

    // socket.on("checkbox", () => {
    //     app.locals.logicServer.PlayerPlay(socket.request.sessionID);
    // });

    // socket.on("exit", () => {
    //     app.locals.logicServer.exit(socket.request.sessionID);
    // });

});