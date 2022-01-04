import TweetsStreamer from '../bot/interfaces/TweetsStreamer';
import Twit from 'twit';
import Tweet from '../bot/types/Tweet';

class TwitTweetsStreamer implements TweetsStreamer {
  private readonly twit: Twit;
  private readonly accountId: string;

  constructor(twit: Twit, accountId: string) {
    this.twit = twit;
    this.accountId = accountId;
  }

  startStreaming(streamCallback: (tweet: Tweet) => void): void {
    const stream = this.twit.stream('statuses/filter', {
      follow: this.accountId,
    });
    stream.on('tweet', tweet => this.tweetListener(tweet, streamCallback));
  }

  private tweetListener(
    tweet: Twit.Twitter.Status,
    streamCallback: (tweet: Tweet) => void
  ): void {
    if (tweet.user.id.toString() === this.accountId) {
      streamCallback({
        id: tweet.id_str,
        rt: tweet.hasOwnProperty('retweeted_status'),
        status: tweet.text,
        mediaHttpsUrls: tweet.entities.media.map(
          media => media.media_url_https
        ),
      });
    }
  }
}

export default TwitTweetsStreamer;
