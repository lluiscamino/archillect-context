import Tweet from './types/Tweet';
import Keyword from './types/Keyword';

const MAX_TWEET_LENGTH = 280;

function buildOutputTweet(
  inReplyToId: string | undefined,
  keywords: Keyword[]
): Tweet {
  const keywordNames = keywords.map(keyword => keyword.name);
  const keywordNamesInTweet = getKeywordNamesInTweet(keywordNames);
  return {
    rt: false,
    status: `.@archillect Related keywords: "${keywordNamesInTweet.join(
      ', '
    )}"`,
    inReplyToId: inReplyToId,
    mediaHttpsUrls: [],
  };
}

function getKeywordNamesInTweet(keywordNames: string[]): string[] {
  const keywordNamesInTweet = [];
  let numChars = 33; // '.@archillect Related keywords: ""'.length
  for (const keyword of keywordNames) {
    numChars += keyword.length + 2; // keyword.length + ', '.length
    if (numChars > MAX_TWEET_LENGTH) {
      break;
    }
    keywordNamesInTweet.push(keyword);
  }
  return keywordNamesInTweet;
}

export default buildOutputTweet;
