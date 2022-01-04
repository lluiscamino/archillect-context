import Tweet from './types/Tweet';

function validateInputTweet(tweet: Tweet) {
  return !tweet.rt && tweet.mediaHttpsUrls.length === 1;
}

export default validateInputTweet;
