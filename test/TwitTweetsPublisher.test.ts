import TwitTweetsPublisher from '../src/twitterapi/TwitTweetsPublisher';
import Twit, {Options} from 'twit';

jest.mock('twit');

const options: Options = {
  consumer_key: '',
  consumer_secret: '',
};
const twit = new Twit(options);

test('Twit.post is called on TwitTweetsPublisher.postResponseTweet call', async () => {
  const twitTweetsPublisher = new TwitTweetsPublisher(twit);
  const tweet = {
    rt: false,
    status: 'Hello, world!',
    inReplyToId: '20',
    mediaHttpsUrls: [],
  };
  await twitTweetsPublisher.postTweet(tweet);
  expect(twit.post).toHaveBeenCalledTimes(1);
  expect(twit.post).toHaveBeenCalledWith('statuses/update', {
    status: tweet.status,
    in_reply_to_status_id: tweet.inReplyToId,
  });
});

test('TwitTweetsPublisher.postResponseTweet returns null on success', async () => {
  const twitTweetsPublisher = new TwitTweetsPublisher(twit);
  const tweet = {
    rt: false,
    status: 'Hello, world!',
    inReplyToId: '20',
    mediaHttpsUrls: [],
  };
  const returnVal = await twitTweetsPublisher.postTweet(tweet);
  expect(returnVal).toBeNull();
});

test('TwitTweetsPublisher.postResponseTweet returns Error object on error', async () => {
  const twitTweetsPublisher = new TwitTweetsPublisher(twit);
  const error = new Error('Twit error');
  jest.spyOn(twit, 'post').mockImplementationOnce(() => {
    throw error;
  });
  const tweet = {
    rt: false,
    status: 'Hello, world!',
    inReplyToId: '20',
    mediaHttpsUrls: [],
  };
  const returnVal = await twitTweetsPublisher.postTweet(tweet);
  expect(returnVal).toEqual(error);
});
