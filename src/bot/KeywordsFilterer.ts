import Keyword from './types/Keyword';

class KeywordsFilterer implements KeywordsFilterer {
  private static URL_REGEX = new RegExp(
    '(https?:\\/\\/)?([\\w\\-])+\\.{1}([a-zA-Z]{2,63})([\\/\\w-]*)*\\/?\\??([^#\\n\\r]*)?#?([^\\n\\r]*)'
  );

  private readonly bannedKeywordNames: string[];

  constructor(bannedKeywordNames: string[]) {
    this.bannedKeywordNames = bannedKeywordNames.map(keywordName =>
      keywordName.toLowerCase()
    );
  }

  public filter(keywords: Keyword[]): Keyword[] {
    return keywords.filter(keyword => this.isValidKeyword(keyword.name));
  }

  private isValidKeyword(keywordName: string): boolean {
    return (
      keywordName !== '' &&
      this.keywordNameIsNotBanned(keywordName) &&
      this.keywordNameIsNotUrl(keywordName)
    );
  }

  private keywordNameIsNotBanned(keywordName: string): boolean {
    return !this.bannedKeywordNames.includes(keywordName.toLowerCase());
  }

  private keywordNameIsNotUrl(keywordName: string): boolean {
    return !KeywordsFilterer.URL_REGEX.test(keywordName);
  }
}

export default KeywordsFilterer;
