const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.post('/payments', (req, res) => {
  const { amount, currency } = req.body;
  if (!amount || !currency) {
    return res.status(400).json({ error: 'amount and currency required' });
  }
  res.status(201).json({
    id: `pay_${Date.now()}`,
    amount,
    currency,
    status: 'created'
  });
});

app.get('/payments/:id', (req, res) => {
  res.json({
    id: req.params.id,
    status: 'completed',
    amount: 100,
    currency: 'BRL'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Payments API running on :${PORT}`));

module.exports = app;