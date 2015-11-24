import test from 'blue-tape';
import bandwidth from '../src';
import http from 'http';
import express from 'express';
import transform from 'express-transform';
import fetch from 'node-fetch';
import lazystream from './utils/lazystream';

let httpServer;

const setup = () => {
  const app = express();
  app.use(transform());

  const getBw = new Promise((resolve) => {
    app.use(bandwidth(resolve));
  });

  app.use((req, res) => {
    const requestedBytes = parseInt(req.path.substring(1), 10);
    lazystream(requestedBytes).pipe(res);
  });

  httpServer = http.createServer(app).listen();
  const httpPort = httpServer.address().port;
  const url = `http://localhost:${httpPort}`;
  return Promise.resolve({ url, getBw });
};

const tearDown = () => {
  httpServer.close();
};

test('bandwidth', (t) => {
  return setup()
    .then(({ url, getBw }) => {
      return fetch(`${url}/30`, {
        method: 'post',
        body: lazystream(20),
      })
      .then((res) => res.text())
      .then(() => getBw)
      .then((bw) => {
        t.equal(bw.incoming, 20);
        t.equal(bw.outgoing, 30);
      });
    })
    .then(tearDown);
});

