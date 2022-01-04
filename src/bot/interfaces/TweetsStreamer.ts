import Tweet from '../types/Tweet';

interface TweetsStreamer {
  startStreaming(streamCallback: (tweet: Tweet) => void): void;
}

export default TweetsStreamer;
