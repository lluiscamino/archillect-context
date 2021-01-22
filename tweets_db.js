const fs = require("fs");
const CSV = require("comma-separated-values");
const fileName = "tweets.csv";
const columns = ["image", "archillect_tweet_id", "date", "labels"];

function init() {
    if (!fs.existsSync(fileName)) {
        fs.writeFile(fileName, columns.join(",") + "\n", () => {});
    }
}

function insert(archillectTweet, visionResult) {
    const row = [
        archillectTweet.entities.media[0].media_url_https,  // Image
        archillectTweet.id_str,                             // Tweet ID
        Math.floor(new Date().getTime() / 1000),            // Date
        JSON.stringify(visionResult)                        // Labels
    ];
    const csvRow = new CSV([row]).encode();
    fs.appendFile(fileName, csvRow + "\n", () => {});
}

init();
exports.insert = insert;
