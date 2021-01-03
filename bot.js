const Twit = require('twit');
const vision = require('@google-cloud/vision');
const alertSender = require('./alertmailer');
const config = require('./config.json');
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = config.google_vision_api.application_credentials_file;

const twit = new Twit(config.twitter);
const visionClient = new vision.ImageAnnotatorClient();
const archillectID = config.twitter.archillect_id;
const stream = twit.stream('statuses/filter', { follow: archillectID });
const responsesQueue = [];
let archillectTweets = 0;

sendStartupNotification();
stream.on('tweet', tweet => {
    handleArchillectTweet(tweet);
});

function sendStartupNotification() {
    alertSender.mail("Bot started", "Archillect Context started");
}

async function handleArchillectTweet(tweet) {
    if (!isValidArchillectTweet(tweet)) return;
    if (archillectTweets++ % 2 != 0) return;
    const image = tweet.entities.media[0].media_url_https;
    const keywords = await getRelatedKeywords(image);
    const response = `.@archillect Related keywords: "${keywords.join(', ')}"`;
    handleResponse(tweet.id_str, response);
}

function isValidArchillectTweet(tweet) {
    return tweet.user.id === archillectID && 
    !tweet.hasOwnProperty('retweeted_status') &&
    tweet.entities.media.length === 1;
}

async function getRelatedKeywords(image) {
    const keywords = [];
    const [result] = await visionClient.labelDetection(image);
    for (const label of result.labelAnnotations) {
        const keyword = label.description;
        if (!isValidKeyword(keyword)) continue;
        keywords.push(keyword);
    }
    return keywords;
}

function isValidKeyword(keyword) {
    const bannedKeywords = config.bot.banned_keywords;
    const urlRegex = new RegExp(config.bot.url_regex);
    return !bannedKeywords.includes(keyword.toLowerCase()) && !urlRegex.test(keyword);
}

function handleResponse(archillectTweetId, response) {
    const responsesQueueMaxLength = config.bot.responses_queue_max_length;
    responsesQueue.push({tweet_id: archillectTweetId, response: response});
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
        twit.post('statuses/update', params, responseCallback);
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