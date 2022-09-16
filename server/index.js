const app = require('express')();
const {Server} = require('socket.io');
const next = require('next');
const https = require('httpolyglot');
const {SocketConnection, mongo} = require('./services');
const {logger, constants} = require("./utils");

const dev = !constants.env;
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();
const httpsServer = https.createServer({}, app);

let port = process.env.PORT || 3000;

nextApp.prepare().then(() => {
    app.get('*', (req, res) => {
        return nextHandler(req, res);
    });
    httpsServer.listen(port, (err) => {
        if (err) throw err;
        logger.log('listening on port: ' + port);
    });
});

const io = new Server(httpsServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

mongo().then();
SocketConnection(io);
