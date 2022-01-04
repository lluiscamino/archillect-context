import TweetsStreamer from './interfaces/TweetsStreamer';
import ImageKeywordsExtractor from './interfaces/ImageKeywordsExtractor';
import config from '../../config.json';
import TweetsPublisher from './interfaces/TweetsPublisher';
import Tweet from './types/Tweet';
import MetricsLogger from './interfaces/MetricsLogger';
import KeywordsFilterer from './KeywordsFilterer';
import validateInputTweet from './validateInputTweet';
import buildOutputTweet from './buildOutputTweet';

class Bot {
  private readonly keywordsFilterer: KeywordsFilterer = new KeywordsFilterer(
    config.bot.banned_keywords
  );

  private readonly archillectTweetsStreamer: TweetsStreamer;
  private readonly imageKeywordsExtractor: ImageKeywordsExtractor;
  private readonly tweetsPublisher: TweetsPublisher;
  private readonly metricsLogger: MetricsLogger;

  private receivedArchillectTweets = 0;
  private outputTweetsQueue: Tweet[] = [];

  constructor(
    archillectTweetsStreamer: TweetsStreamer,
    imageKeywordsExtractor: ImageKeywordsExtractor,
    tweetsPublisher: TweetsPublisher,
    metricsLogger: MetricsLogger
  ) {
    this.archillectTweetsStreamer = archillectTweetsStreamer;
    this.imageKeywordsExtractor = imageKeywordsExtractor;
    this.tweetsPublisher = tweetsPublisher;
    this.metricsLogger = metricsLogger;
  }

  start(): void {
    this.metricsLogger.logBotStart();
    this.archillectTweetsStreamer.startStreaming(tweet =>
      this.handleArchillectTweet(tweet)
    );
  }

  private async handleArchillectTweet(inputTweet: Tweet): Promise<void> {
    if (
      this.receivedArchillectTweets++ % 2 !== 0 ||
      !validateInputTweet(inputTweet)
    ) {
      return;
    }
    const imageKeywords = await this.imageKeywordsExtractor.getKeywords(
      inputTweet.mediaHttpsUrls[0]
    );
    const filteredKeywords = this.keywordsFilterer.filter(imageKeywords);
    if (filteredKeywords.length === 0) {
      return;
    }
    const outputTweet = buildOutputTweet(inputTweet.id, filteredKeywords);
    this.outputTweetsQueue.push(outputTweet);
    this.metricsLogger.logEnqueuedTweet(outputTweet);
    if (this.outputTweetsQueueIsFull()) {
      this.publishOutputTweetsInQueue();
      this.emptyOutputTweetsQueue();
    }
  }

  private outputTweetsQueueIsFull(): boolean {
    return (
      this.outputTweetsQueue.length === config.bot.responses_queue_max_length
    );
  }

  private publishOutputTweetsInQueue(): void {
    this.outputTweetsQueue.forEach(tweet => this.publishOutputTweet(tweet));
  }

  private publishOutputTweet(tweet: Tweet): void {
    this.tweetsPublisher
      .postTweet(tweet)
      .then(error => this.logTweetPublish(tweet, error));
  }

  private logTweetPublish(tweet: Tweet, error: Error | null) {
    if (error === null) {
      this.metricsLogger.logPublishedTweet(tweet);
    } else {
      this.metricsLogger.logBotError(error);
    }
  }

  private emptyOutputTweetsQueue(): void {
    this.outputTweetsQueue = [];
  }
}

export default Bot;
