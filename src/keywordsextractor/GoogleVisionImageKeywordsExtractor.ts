import ImageKeywordsExtractor from '../bot/interfaces/ImageKeywordsExtractor';
import {ImageAnnotatorClient} from '@google-cloud/vision';
import Keyword from '../bot/types/Keyword';

class GoogleVisionImageKeywordsExtractor implements ImageKeywordsExtractor {
  private readonly visionClient: ImageAnnotatorClient;

  constructor(
    visionClient: ImageAnnotatorClient,
    applicationCredentialsFilePath: string
  ) {
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] =
      applicationCredentialsFilePath;
    this.visionClient = visionClient;
  }

  async getKeywords(imageUrl: string): Promise<Keyword[]> {
    const [result] = await this.visionClient.webDetection(imageUrl);
    const labels = result.webDetection?.webEntities;
    if (!labels) {
      return [];
    }
    return labels
      .filter(
        (label): label is {description: string; score: number} =>
          Boolean(label.description) && Boolean(label.score)
      )
      .map(label => ({
        name: label.description,
        score: label.score,
      }));
  }
}

export default GoogleVisionImageKeywordsExtractor;
