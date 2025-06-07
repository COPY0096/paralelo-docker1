// notificador/index.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.post('/notify', (req, res) => {
  const { deviceId, message } = req.body;
  console.log(`🔔 [Notificador] Enviando push a dispositivo ${deviceId}: "${message}"`);
  res.json({ status: 'notificado', deviceId, message });
});

app.listen(PORT, () => {
  console.log(`Servicio Notificador escuchando en puerto ${PORT}`);
});
