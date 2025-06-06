// “TODO: implementar lógica”.
const express = require('express');
const { Worker } = require('worker_threads');
const os = require('os');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/procesar', (req, res) => {
  const payload = req.body; // { taskId, deviceId, complexity }

  const worker = new Worker('./worker.js', { workerData: payload });

  worker.on('message', result => {
    const fetch = require('node-fetch');
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
