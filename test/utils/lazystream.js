import stream from 'stream';

class LazyStream extends stream.Readable {
  constructor(size) {
    super();
    this.size = size;
    this.i = 0;
  }

  _read() {
    // console.log(this.i);
    if (this.i === this.size) {
      console.log('pushing null');
      this.push(null);
      return;
    }
    this.push('0');
    this.i++;
  }
}

export default (...args) => {
  return new LazyStream(...args);
};
