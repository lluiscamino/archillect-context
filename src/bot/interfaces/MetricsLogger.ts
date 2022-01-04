import Tweet from '../types/Tweet';

interface MetricsLogger {
  logBotStart(): void;
  logEnqueuedTweet(tweet: Tweet): void;
  logPublishedTweet(tweet: Tweet): void;
  logBotError(error: Error): void;
}

export default MetricsLogger;
