jest.mock('kinesis-readable');
jest.mock('./handler');
const readableStream = require('kinesis-readable');
const ServerlessPluginOfflineKinesisStream = require('../src');

const handler = require('./handler');
const serverless = {
  config: {
    servicePath: '../test',
  },
  service: {
    custom: {
      'serverless-offline': {},
      kinesisStream: {
        streams: [{ table: 'table-name', functions: ['funtionA'] }],
      },
      functions: { funtionA: { handler: 'handler.funtionA' } },
    },
  },
};
const options = {};

describe('Serverless Plugin Offline Kinesis Stream', () => {
  test('Meet serverless plugin interface', () => {
    const plugin = new ServerlessPluginOfflineKinesisStream(
      serverless,
      options
    );
    expect(plugin.hooks).toEqual({
      'before:offline:start:init': expect.any(Function),
    });
  });

  test('should create handler function', () => {
    const plugin = new ServerlessPluginOfflineKinesisStream(
      serverless,
      options
    );
    const hanler = plugin.createHandler({ handler: 'handler.funtionA' });
    expect(hanler).toEqual(expect.any(Function));
  });

  test('should init subscriber', () => {
    const onMockFn = jest.fn();
    readableStream.mockReturnValue({ on: onMockFn });

    const plugin = new ServerlessPluginOfflineKinesisStream(
      serverless,
      options
    );
    plugin.hooks['before:offline:start:init']();
    expect(onMockFn).toHaveBeenCalled();
  });
});
