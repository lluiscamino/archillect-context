import ConsoleLogger from '../src/metricslogger/ConsoleLogger';

test('console.error is called on MetricsLoggerImpl.logBotError call', () => {
  const consoleLogger = new ConsoleLogger();
  console.error = jest.fn();
  const error = new Error('Error');
  consoleLogger.logBotError(error);
  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith(error);
});

test('console.log is called on MetricsLoggerImpl.logBotStart call', () => {
  const consoleLogger = new ConsoleLogger();
  console.log = jest.fn();
  consoleLogger.logBotStart();
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(
    `${getCurrentDateString()} Bot started`
  );
});

test('console.log is called on MetricsLoggerImpl.logEnqueuedTweet call', () => {
  const consoleLogger = new ConsoleLogger();
  console.log = jest.fn();
  const tweet = {
    rt: false,
    status: 'Hello, world!',
    inReplyToId: '20',
    mediaHttpsUrls: [],
  };
  consoleLogger.logEnqueuedTweet(tweet);
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(
    `${getCurrentDateString()} Tweet added to queue: ${tweet.status} (${
      tweet.inReplyToId
    })`
  );
});

test('console.log is called on MetricsLoggerImpl.logPublishedTweet call', () => {
  const consoleLogger = new ConsoleLogger();
  console.log = jest.fn();
  const tweet = {
    rt: false,
    status: 'Hello, world!',
    inReplyToId: '20',
    mediaHttpsUrls: [],
  };
  consoleLogger.logPublishedTweet(tweet);
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(
    `${getCurrentDateString()} Tweet published: ${tweet.status} (${
      tweet.inReplyToId
    })`
  );
});

function getCurrentDateString(): string {
  return new Date().toLocaleString();
}
