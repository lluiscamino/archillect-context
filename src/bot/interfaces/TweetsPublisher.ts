import Tweet from '../types/Tweet';

interface TweetsPublisher {
  postTweet(tweet: Tweet): Promise<Error | null>;
}

export default TweetsPublisher;
