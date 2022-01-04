import validateInputTweet from '../src/bot/validateInputTweet';

test('InputTweetsValidator.validate returns false on retweet', () => {
  const tweet = {
    rt: true,
    status: undefined,
    mediaHttpsUrls: ['https://t.co/media.jpg'],
  };
  expect(validateInputTweet(tweet)).toBeFalsy();
});

test('InputTweetsValidator.validate returns false on no media', () => {
  const tweet = {
    rt: false,
    status: undefined,
    mediaHttpsUrls: [],
  };
  expect(validateInputTweet(tweet)).toBeFalsy();
});

test('InputTweetsValidator.validate returns false on more than one media', () => {
  const tweet = {
    rt: false,
    status: undefined,
    mediaHttpsUrls: ['https://t.co/media1.jpg', 'https://t.co/media2.jpg'],
  };
  expect(validateInputTweet(tweet)).toBeFalsy();
});

test('InputTweetsValidator.validate returns false on no retweet and one media', () => {
  const tweet = {
    rt: false,
    status: undefined,
    mediaHttpsUrls: ['https://t.co/media.jpg'],
  };
  expect(validateInputTweet(tweet)).toBeTruthy();
});
