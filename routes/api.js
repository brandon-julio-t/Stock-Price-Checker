"use strict";

const Service = require("../services/stock-price-checker-proxy.js");

module.exports = function (app) {
  const service = new Service();
  const likeDb = {};

  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;

    const stocks = Array.isArray(stock) ? stock : [stock];

    const stocksData = await Promise.all(
      stocks.map((symbol) => service.getQuote(symbol).then((resp) => resp.data))
    );

    let responseData = stocksData.map((stock) => ({
      stock: stock.symbol,
      price: stock.latestPrice,
      likes: likeDb[stock.symbol]?.length ?? 0,
    }));

    if (responseData.length === 1) {
      responseData = responseData[0];
    } else {
      const [stock1, stock2] = responseData;
      stock1.rel_likes = stock1.likes - stock2.likes;
      stock2.rel_likes = stock2.likes - stock1.likes;
    }

    if (like === "true") {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      stocksData.forEach((stock) => {
        const { symbol } = stock;
        const likesData = likeDb[symbol] ?? [];
        if (likesData.includes(ip)) return;
        likeDb[symbol] = [...likesData, ip];
      });
    }

    res.json({ stockData: responseData });
  });
};
