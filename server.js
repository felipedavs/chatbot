const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Token de verificação (o mesmo usado no ChatFlow e na Meta)
const VERIFY_TOKEN = "mysecretkey123";

app.use(cors());
app.use(bodyParser.json());

// ✅ Rota de teste básica
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor WhatsApp Backend rodando com sucesso!' });
});

// ✅ Webhook de verificação (Meta) e teste (ChatFlow)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // 👉 Caso seja verificação do ChatFlow AI (sem parâmetros da Meta)
  if (!mode && !token && !challenge) {
    return res.status(200).json({
      success: true,
      message: 'Webhook disponível e funcional para ChatFlow AI!'
    });
  }

  // 👉 Caso seja verificação oficial da Meta
  if (mode && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado com sucesso pela Meta!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Webhook para mensagens recebidas
app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log('📩 Mensagem recebida:', JSON.stringify(body, null, 2));
  res.sendStatus(200);
});

// ✅ Endpoint de diagnóstico opcional
app.get('/ping', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Conexão com backend WhatsApp OK!',
    origin: 'Render.com'
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
