import buildOutputTweet from '../src/bot/buildOutputTweet';

test('buildOutputTweet inReplyToId is correct', () => {
  expect(buildOutputTweet('20', []).inReplyToId).toEqual('20');
});

test('buildOutputTweet joins keyword names by commas', () => {
  const keywords = [
    {name: 'Lorem ipsum', score: 0.5},
    {name: 'ut facilisis', score: 0.5},
    {name: 'ornare', score: 0.5},
    {name: 'adipiscing elit', score: 0.5},
    {name: 'sem', score: 0.5},
  ];
  const expectedTweetStatus =
    '.@archillect Related keywords: "Lorem ipsum, ut facilisis, ornare, adipiscing elit, sem"';
  expect(buildOutputTweet(undefined, keywords).status).toEqual(
    expectedTweetStatus
  );
});

test('buildOutputTweet returns status with 280 characters or less', () => {
  const keywords = [
    {name: 'Lorem ipsum dolor sit amet', score: 0.5},
    {name: 'consectetuer adipiscing elit', score: 0.5},
    {name: 'Aenean commodo ligula eget dolor', score: 0.5},
    {name: 'Aenean massa', score: 0.5},
    {
      name: 'Cum sociis natoque penatibus et magnis dis parturient montes',
      score: 0.5,
    },
    {name: 'nascetur ridiculus mus', score: 0.5},
    {name: 'Donec quam felis', score: 0.5},
    {name: 'ultricies nec', score: 0.5},
    {name: 'pellentesque eu', score: 0.5},
    {name: 'pretium quis', score: 0.5},
    {name: 'sem', score: 0.5},
    {name: 'Nulla consequat massa quis enim', score: 0.5},
  ];
  expect(buildOutputTweet(undefined, keywords).status?.length).toBeLessThan(
    280
  );
});
