const Twit = require("twit");
const vision = require("@google-cloud/vision");
const database = require("./tweets_db");
const alertSender = require("./alertmailer");
const config = require("./config.json");
process.env["GOOGLE_APPLICATION_CREDENTIALS"] =
    config.google_vision_api.application_credentials_file;

const twit = new Twit(config.twitter);
const visionClient = new vision.ImageAnnotatorClient();
const archillectID = config.twitter.archillect_id;
const stream = twit.stream("statuses/filter", { follow: archillectID });
const responsesQueue = [];
let archillectTweets = 0;

sendStartupNotification();
streamTweets();

function sendStartupNotification() {
    alertSender.mail("Bot started", "Archillect Context started");
}

function streamTweets() {
    stream.on("tweet", tweet => {
        handleArchillectTweet(tweet);
    });
}

async function handleArchillectTweet(tweet) {
    if (!isValidArchillectTweet(tweet)) return;
    if (archillectTweets++ % 2 != 0) return;
    const image = tweet.entities.media[0].media_url_https;
    const visionResult = await getVisionResult(image);
    const keywords = getRelatedKeywords(visionResult);
    if (keywords.length === 0) return;
    const response = `.@archillect Related keywords: "${keywords.join(", ")}"`;
    handleResponse(tweet.id_str, response);
    database.insert(tweet, visionResult);
}

function isValidArchillectTweet(tweet) {
    return (
        tweet.user.id === archillectID &&
        !tweet.hasOwnProperty("retweeted_status") &&
        tweet.entities.media.length === 1
    );
}

async function getVisionResult(image) {
    const [result] = await visionClient.webDetection(image);
    return result.webDetection;
}

function getRelatedKeywords(visionResult) {
    const keywords = [];
    for (const label of visionResult.webEntities) {
        const keyword = label.description;
        if (!isValidKeyword(keyword)) continue;
        keywords.push(keyword);
    }
    return keywords;
}

function isValidKeyword(keyword) {
    const bannedKeywords = config.bot.banned_keywords;
    const urlRegex = new RegExp(config.bot.url_regex);
    return (
        keyword !== "" &&
        !bannedKeywords.includes(keyword.toLowerCase()) &&
        !urlRegex.test(keyword)
    );
}

function handleResponse(archillectTweetId, response) {
    const responsesQueueMaxLength = config.bot.responses_queue_max_length;
    responsesQueue.push({ tweet_id: archillectTweetId, response: response });
    console.log("Added to queue: " + response);
    if (responsesQueue.length === responsesQueueMaxLength) {
        postAllResponses();
    }
}

function postAllResponses() {
    while (responsesQueue.length > 0) {
        const response = responsesQueue.shift();
        const params = {
            status: response.response,
            in_reply_to_status_id: response.tweet_id
        };
        twit.post("statuses/update", params, responseCallback);
    }
}

async function responseCallback(error, data, _r) {
    if (error) {
        console.log(error);
        await alertSender.mail("Twitter API error", error);
        process.exit(1);
    } else {
        console.log("Published: " + data.text);
    }
}
