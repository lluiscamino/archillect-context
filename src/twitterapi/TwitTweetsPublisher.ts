import Twit from 'twit';
import TweetsPublisher from '../bot/interfaces/TweetsPublisher';
import Tweet from '../bot/types/Tweet';

class TwitTweetsPublisher implements TweetsPublisher {
  private readonly twit: Twit;

  constructor(twit: Twit) {
    this.twit = twit;
  }

  async postTweet(tweet: Tweet): Promise<Error | null> {
    const params = {
      status: tweet.status,
      in_reply_to_status_id: tweet.inReplyToId,
    };
    try {
      await this.twit.post('statuses/update', params);
      return null;
    } catch (error) {
      return error as Error;
    }
  }
}

export default TwitTweetsPublisher;
