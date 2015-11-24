import stream from 'stream';
import initDebug from 'debug';
const debug = initDebug('express-bandwidth');

class BwMonitor extends stream.Transform {
  constructor() {
    super();
    this.size = 0;
  }
  _transform(chunk, encoding, callback) {
    this.size += chunk.length;
    callback(null, chunk);
  }
}

export default (cb) => {
  return (req, res, next) => {
    debug('bandwidth middleware');

    const incoming = new BwMonitor();
    const outgoing = new BwMonitor();

    const maybeDone = (s) => {
      s.maybeDone = true;
      if (incoming.maybeDone && outgoing.maybeDone) {
        return cb({
          incoming: incoming.size,
          outgoing: outgoing.size,
        });
      }
    };

    incoming.on('finish', () => maybeDone(incoming));
    outgoing.on('finish', () => maybeDone(outgoing));

    req.pipe(incoming);
    res.transform(outgoing);

    const done = () => {
      const socket = req.connection;
      console.log('bytesRead', socket.bytesRead);
      console.log('bytesWritten', socket.bytesWritten);
    };
    res.on('close', done);
    res.on('finish', done);
    next();
  };
};
