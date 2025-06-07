const express = require('express');
const { Worker } = require('worker_threads');
const os = require('os');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Ruta de health check para ECS
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/procesar', (req, res) => {
  const payload = req.body; // { taskId, deviceId, complexity }

  // Crear un worker que ejecute ./worker.js con workerData = payload
  const worker = new Worker('./worker.js', { workerData: payload });

  worker.on('message', result => {
    // Cuando el worker termina, notificar al Notificador
    fetch(`${process.env.URL_NOTIFICADOR}/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: payload.deviceId,
        message: `Tarea ${payload.taskId} completada. Resultado: ${JSON.stringify(result)}`
      })
    })
      .then(() => {
        console.log(`Notificación enviada para tarea ${payload.taskId}`);
      })
      .catch(err => console.error('Error al notificar:', err));

    // Responder al API Gateway con el resultado
    res.json({ taskId: payload.taskId, status: 'procesado', result });
  });

  worker.on('error', err => {
    console.error('Error en worker:', err);
    res.status(500).json({ error: 'Error en procesamiento' });
  });

  worker.on('exit', code => {
    if (code !== 0) console.error(`Worker finalizó con código: ${code}`);
  });
});

app.listen(PORT, () => {
  console.log(`Servicio Procesador escuchando en puerto ${PORT}`);
});
