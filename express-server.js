const express = require("express");
const app = express();

const conversionRates = {
  usd: 1500,
  eur: 1700,
  cny: 2000,
};

function validateConvertRequest(req, res, next) {
  const { amount, currency } = req.query;

  if (amount === undefined) {
    return res.status(400).json({ error: "Missing amount" });
  }

  if (currency === undefined) {
    return res.status(400).json({ error: "Missing currency" });
  }

  const parsedAmount = Number(amount);
  const normalizedCurrency = String(currency).toLowerCase();

  if (Number.isNaN(parsedAmount)) {
    return res.status(400).json({ error: "Invalid number" });
  }

  if (!conversionRates[normalizedCurrency]) {
    return res.status(400).json({ error: "Invalid currency" });
  }

  req.convertData = {
    amount: parsedAmount,
    currency: normalizedCurrency,
  };

  next();
}

app.get("/convert", validateConvertRequest, (req, res) => {
  const { amount, currency } = req.convertData;
  const convertedAmount = amount * conversionRates[currency];

  res.json({
    input: {
      amount,
      currency,
    },
    convertedAmount,
    unit: "RWF",
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(2000, () => {
  console.log("Express server listening on http://localhost:2000");
});
