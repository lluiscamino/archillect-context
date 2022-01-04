import Keyword from '../types/Keyword';

interface ImageKeywordsExtractor {
  getKeywords(imageUrl: string): Promise<Keyword[]>;
}

export default ImageKeywordsExtractor;
