const http = require("http");
const url = require("url");
const JsonDB = require("node-json-db").JsonDB;
const JsonDBConfig = require("node-json-db/dist/lib/JsonDBConfig").Config;
const config = require("./config.json");

function sendData(dataPath, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        const database = new JsonDB(new JsonDBConfig("tweets", true, false, "/"));
        const data = database.getData(dataPath);
        res.statusCode = 200;
        res.end(JSON.stringify(data));
    } catch (err) {
        res.statusCode = 404;
        res.end();
    }
}

const server = http.createServer((req, res) => {
    const queryObject = url.parse(req.url,true).query;
    const dataPath = queryObject.path;
    if (typeof dataPath === "string") {
        sendData(dataPath, res);
    } else {
        res.statusCode = 400;
        res.end();
    }
});

server.listen(config.httpserver.port, () => {
    console.log(`Server running at port ${config.httpserver.port}`);
});