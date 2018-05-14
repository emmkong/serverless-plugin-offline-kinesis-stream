const path = require('path');
const _ = require('lodash');
const AWS = require('aws-sdk');
const readableStream = require('kinesis-readable');

function toLambdaEvent(messages) {
  return messages.map((message) => {
    const {
      SequenceNumber,
      ApproximateArrivalTimestamp,
      PartitionKey,
      Data
    } = message;
    return {
      eventID: `shardId-000000000000:${SequenceNumber}`,
      eventVersion: '1.0',
      kinesis: {
        approximateArrivalTimestamp: Date.parse(
          ApproximateArrivalTimestamp
        ).toString(),
        partitionKey: PartitionKey,
        data: Data.toString('base64'),
        kinesisSchemaVersion: '1.0',
        sequenceNumber: SequenceNumber
      },
      invokeIdentityArn: 'arn:aws:iam::EXAMPLE',
      eventName: 'aws:kinesis:record',
      eventSourceARN: 'arn:aws:kinesis:EXAMPLE',
      eventSource: 'aws:kinesis',
      awsRegion: 'ap-southeast-2'
    };
  });
}

class ServerlessPluginOfflineKinesisStream {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.config =
      (serverless.service.custom && serverless.service.custom.kinesisStream) ||
      {};
    this.options = options;
    const offlineConfig =
      this.serverless.service.custom['serverless-offline'] || {};
    this.location = process.cwd();
    if (offlineConfig.location) {
      this.location = process.cwd() + '/' + offlineConfig.location;
    } else if (this.serverless.config.servicePath) {
      this.location = this.serverless.config.servicePath;
    }
    this.createHandler = this.createHandler.bind(this);
    const streams = this.config.streams || [];
    this.streams = streams.map(({ streamName, functions = [] }) => ({
      streamName,
      functions: functions.map((functionName) => {
        const fn = _.get(serverless.service.functions, functionName);
        return fn && this.createHandler(fn);
      })
    }));
    this.provider = 'aws';
    this.commands = {};
    this.hooks = {
      'before:offline:start:init': this.startReadableStreams.bind(this)
    };
  }

  createHandler(fn) {
    const handler = require(this.location + '/' + fn.handler.split('.')[0])[
      fn.handler
        .split('/')
        .pop()
        .split('.')[1]
    ];
    return (event, context = {}) => handler(event, context);
  }

  startReadableStreams() {
    const self = this;
    const {
      config: { host: hostname, port, region = 'localhost' } = {},
      streams
    } = self;

    const endpoint = new AWS.Endpoint(`http://${hostname}:${port}`);

    streams.forEach(({ streamName, functions }) => {
      const client = new AWS.Kinesis({
        endpoint,
        region,
        params: { StreamName: streamName }
      });

      const options = {
        iterator: 'LATEST',
        limit: 1
      };

      const readable = readableStream(client, options);
      readable.on('data', (messages) => {
        functions.forEach((fn) => {
          fn && fn({ Records: toLambdaEvent(messages) });
        });
      });
      readable.on('error', (err) => {
        console.log('[KINESIS STREAM ERROR]' + JSON.stringify(err, null, 2));
      });
      readable.on('end', () => {
        console.log('[KINESIS STREAM] ended!');
      });
    });
  }
}

module.exports = ServerlessPluginOfflineKinesisStream;
