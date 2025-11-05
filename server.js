const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const VERIFY_TOKEN = "mysecretkey123"; // o mesmo do ChatFlow AI

app.use(cors());
app.use(bodyParser.json());

// Rota raiz (teste)
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Servidor ativo e rodando.' });
});

// ✅ Webhook de verificação (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado com sucesso!');
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Token inválido');
  }
});

// ✅ Webhook de mensagens (POST)
app.post('/webhook', (req, res) => {
  console.log('📩 Webhook recebido:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
