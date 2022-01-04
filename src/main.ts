import Bot from './bot/Bot';
import TwitTweetsStreamer from './twitterapi/TwitTweetsStreamer';
import GoogleVisionImageKeywordsExtractor from './keywordsextractor/GoogleVisionImageKeywordsExtractor';
import TwitTweetsPublisher from './twitterapi/TwitTweetsPublisher';
import config from '../config.json';
import Twit from 'twit';
import {ImageAnnotatorClient} from '@google-cloud/vision';
import ConsoleLogger from './metricslogger/ConsoleLogger';

const archillectAccountId = config.twitter.archillect_id.toString();
const googleApplicationCredentialsFilePath =
  config.google_vision_api.application_credentials_file;
const metricsLogger = new ConsoleLogger();
try {
  const twit = new Twit(config.twitter);
  const visionClient = new ImageAnnotatorClient();

  const bot = new Bot(
    new TwitTweetsStreamer(twit, archillectAccountId),
    new GoogleVisionImageKeywordsExtractor(
      visionClient,
      googleApplicationCredentialsFilePath
    ),
    new TwitTweetsPublisher(twit),
    metricsLogger
  );
  bot.start();
} catch (error) {
  metricsLogger.logBotError(error as Error);
  throw error;
}
