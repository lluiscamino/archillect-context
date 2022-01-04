import KeywordsFilterer from '../src/bot/KeywordsFilterer';

test('KeywordsFilterer.filter filters empty keywords', () => {
  const keywordsFilterer = new KeywordsFilterer([]);
  const inputKeywords = [
    {name: 'Valid keyword', score: 0.5},
    {name: '', score: 0.5},
  ];
  const expectedOutputKeywords = [{name: 'Valid keyword', score: 0.5}];
  expect(keywordsFilterer.filter(inputKeywords)).toEqual(
    expectedOutputKeywords
  );
});

test('KeywordsFilterer.filter filters banned keywords', () => {
  const bannedKeywordNames = ['Banned keyword #001', 'Banned keyword #002'];
  const keywordsFilterer = new KeywordsFilterer(bannedKeywordNames);
  const inputKeywords = [
    {name: 'Valid keyword', score: 0.5},
    {name: 'banned keyword #001', score: 0.5},
    {name: 'Banned keyword #001', score: 0.5},
    {name: 'Banned keyword #002', score: 0.5},
  ];
  const expectedOutputKeywords = [{name: 'Valid keyword', score: 0.5}];
  expect(keywordsFilterer.filter(inputKeywords)).toEqual(
    expectedOutputKeywords
  );
});

test('KeywordsFilterer.filter filters URLs', () => {
  const keywordsFilterer = new KeywordsFilterer([]);
  const inputKeywords = [
    {name: 'Valid keyword', score: 0.5},
    {name: 'https://twitter.com/archicontext', score: 0.5},
    {name: 'https://twitter.com/', score: 0.5},
    {name: 'twitter.com', score: 0.5},
    {name: 'www.twitter.com', score: 0.5},
  ];
  const expectedOutputKeywords = [{name: 'Valid keyword', score: 0.5}];
  expect(keywordsFilterer.filter(inputKeywords)).toEqual(
    expectedOutputKeywords
  );
});
