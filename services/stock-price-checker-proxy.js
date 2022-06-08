const axios = require('axios')

module.exports = class StockPriceCheckerProxy {
  url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock';
  cache = new Map();

  async getQuote(symbol) {
    if (this.cache.has(symbol)) {
      return this.cache.get(symbol);
    }
    const response = await axios.get(`${this.url}/${symbol}/quote`);
    this.cache.set(symbol, response);
    return response;
  }
};
