const http = require("http");
const url = require("url");

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname !== "/convert") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const amountParam = query.amount;
  const currencyParam = query.currency;

  if (amountParam === undefined) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing amount" }));
    return;
  }

  if (currencyParam === undefined) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing currency" }));
    return;
  }

  const amount = Number(amountParam);
  const currency = String(currencyParam).toLowerCase();

  if (Number.isNaN(amount)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid number" }));
    return;
  }

  if (!conversionRates[currency]) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid currency" }));
    return;
  }

  const convertedAmount = amount * conversionRates[currency];
  const responseBody = {
    input: {
      amount,
      currency,
    },
    convertedAmount,
    unit: "RWF",
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(responseBody));
});

server.listen(2000, () => {
  console.log("HTTP server listening on http://localhost:2000");
});
