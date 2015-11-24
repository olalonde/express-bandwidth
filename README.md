# express-bandwidth

[![Build Status](https://travis-ci.org/olalonde/express-bandwidth.svg)](https://travis-ci.org/olalonde/express-bandwidth)

Express middleware to monitor the bandwidth of requests.

Limitations:

1) If you use a reverse proxy that does compression / TLS termination,
   the bandwidth will not reflect that.
2) The bandwidth figure doesn't currently include HTTP headers, only
   request/response body.

## Install

```javascript
npm install --save express-bandwidth express-transform
```

## Usage

```javascript
import transform from 'express-transform';
import bandwidth from 'express-bandwidth';

app.use(transform());

app.use(bandwidth((bw) => {
  console.log(bw.incoming);
  console.log(bw.outgoing);
}));
```
