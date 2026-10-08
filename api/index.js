const express = require('express');
const bomb = require('./api/bomb');

const app = express();
app.use(express.json());
app.use('/api', bomb);

app.get('/', (req, res) => {
  res.json({ status: 'ok', endpoints: ['/api/bomb?phone=9999999999'] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('running on ' + PORT));