# serverless-plugin-offline-kinesis-stream

[![CircleCI Status][circleci-badge]][circleci-url]
[![NPM Version][npm-badge]][npm-url]
[![License][license-badge]][license-url]

> Serverless framework offline plugin to support kinesis stream

This plugin pull from kinesis stream and trigger serverless function if any records detected.

# Installation

Install package

```bash
$ npm install --save serverless-plugin-offline-kinesis-stream
```

# Usage

Add following config to serverless.yml file.

```yml
plugins:
  - serverless-plugin-offline-dynamodb-stream
  - serverless-plugin-offline-kinesis-stream
custom:
  dynamodbStream:
    host: {LOCAL_DYNAMODB_HOST}
    port: {LOCAL_DYNAMODB_PORT}
    streams:
      - table: {TABLE_NAME}
        functions:
          - {FUNCTION_NAME}
  kinesisStream:
    host: {LOCAL_KINESIS_HOST}
    port: {LOCAL_KINESIS_PORT}
    intervalMillis: 5000
    streams:
      - streamName: {STREAM_NAME}
        functions:
          - {FUNCTION_NAME}
```

Ensure your local kinesis is up and running, or you coulde also consider using [kinesalite](https://github.com/mhart/kinesalite) before starting your serverless offline process.

```bash
$ serverless offline start
```

# Development

* Cloning the repo

```bash
$ git clone https://github.com/orchestrated-io/serverless-plugin-offline-kinesis-stream.git
```

* Installing dependencies

```bash
$ npm install
```

* Running scripts

| Action                                   | Usage               |
| ---------------------------------------- | ------------------- |
| Linting code                             | `npm run lint`      |
| Running unit tests                       | `npm run jest`      |
| Running code coverage                    | `npm run coverage`  |
| Running lint + tests                     | `npm test`          |

# Author

[Emmanuel Kong](https://github.com/emmkong)

# License

[MIT](https://github.com/orchestrated-io/serverless-plugin-offline-kinesis-stream/blob/master/LICENSE)

[circleci-badge]: https://circleci.com/gh/orchestrated-io/serverless-plugin-offline-kinesis-stream/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/orchestrated-io/serverless-plugin-offline-kinesis-stream

[npm-badge]: https://img.shields.io/npm/v/serverless-plugin-offline-kinesis-stream.svg
[npm-url]: https://www.npmjs.com/package/serverless-plugin-offline-kinesis-stream

[license-badge]: https://img.shields.io/github/license/orchestrated-io/serverless-plugin-offline-kinesis-stream.svg
[license-url]: https://opensource.org/licenses/MIT
