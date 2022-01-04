import MetricsLogger from '../bot/interfaces/MetricsLogger';
import Tweet from '../bot/types/Tweet';

class ConsoleLogger implements MetricsLogger {
  logBotError(error: Error): void {
    console.error(error);
  }

  logBotStart(): void {
    console.log(`${this.getCurrentDateString()} Bot started`);
  }

  logEnqueuedTweet(tweet: Tweet): void {
    console.log(
      `${this.getCurrentDateString()} Tweet added to queue: ${tweet.status} (${
        tweet.inReplyToId
      })`
    );
  }

  logPublishedTweet(tweet: Tweet): void {
    console.log(
      `${this.getCurrentDateString()} Tweet published: ${tweet.status} (${
        tweet.inReplyToId
      })`
    );
  }

  private getCurrentDateString(): string {
    return new Date().toLocaleString();
  }
}

export default ConsoleLogger;
