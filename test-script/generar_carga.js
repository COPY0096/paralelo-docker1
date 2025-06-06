console.log('Script de generación de carga - placeholder');

const fetch = require('node-fetch');

const URL_API_GATEWAY = process.env.URL_API_GATEWAY || 'http://localhost:3000/api/facturar';
const TOTAL_REQUESTS = parseInt(process.env.TOTAL_REQUESTS) || 20;
const COMPLEXITY = parseInt(process.env.COMPLEXITY) || 80000;

async function enviarTarea(i) {
  const taskId = `Task-${i}-${Date.now()}`;
  const deviceId = `Device-${i}`;
  try {
    const resp = await fetch(URL_API_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, deviceId, complexity: COMPLEXITY })
    });
    const data = await resp.json();
    console.log(`Petición ${i} enviada. Respuesta:`, data);
  } catch (err) {
    console.error(`Error en petición ${i}:`, err);
  }
}

(async () => {
  const promises = [];
  console.log(`Enviando ${TOTAL_REQUESTS} peticiones concurrentes a ${URL_API_GATEWAY}`);
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    promises.push(enviarTarea(i));
  }
  await Promise.all(promises);
  console.log('Todas las peticiones fueron enviadas.');
})();
