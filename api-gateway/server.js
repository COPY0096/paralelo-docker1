console.log('Servidor API Gateway - placeholder');

const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const URL_PROCESADOR = process.env.URL_PROCESADOR || 'http://nginx:80';
const URL_NOTIFICADOR = process.env.URL_NOTIFICADOR || 'http://notificador:3002';

app.post('/api/facturar', async (req, res) => {
  const { taskId, deviceId, complexity } = req.body;
  try {
    const response = await fetch(`${URL_PROCESADOR}/procesar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, deviceId, complexity })
    });
    const data = await response.json();
    res.json({ status: 'enviado a procesamiento', detail: data });
  } catch (err) {
    console.error('Error al invocar procesador:', err);
    res.status(500).json({ error: 'Error en API Gateway' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway escuchando en puerto ${PORT}`);
});
