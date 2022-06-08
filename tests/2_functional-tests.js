const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Viewing one stock: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG", like: "true" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.strictEqual(res.body.stockData.likes, 0);
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG", like: "true" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isString(res.body.stockData.stock);
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.strictEqual(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["GOOG", "MSFT"] })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isArray(res.body.stockData);
        res.body.stockData.forEach((stock) => {
          assert.isString(stock.stock);
          assert.isNumber(stock.price);
          assert.isNumber(stock.rel_likes);
        });
        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["GOOG", "MSFT"], like: "true" })
      .end((err, res) => {
        assert.strictEqual(res.status, 200);
        assert.property(res.body, "stockData");
        assert.isArray(res.body.stockData);
        res.body.stockData.forEach((stock) => {
          assert.isString(stock.stock);
          assert.isNumber(stock.price);
          assert.isNumber(stock.rel_likes);
        });
        assert.strictEqual(res.body.stockData.length, 2);
        const [stock1, stock2] = res.body.stockData;
        assert.strictEqual(stock1.rel_likes, stock1.likes - stock2.likes);
        assert.strictEqual(stock2.rel_likes, stock2.likes - stock1.likes);
        done();
      });
  });
});
