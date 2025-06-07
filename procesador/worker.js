// procesador/worker.js

// 1) Importar parentPort y workerData desde worker_threads
const { parentPort, workerData } = require('worker_threads');

/**
 * Aquí simulamos una tarea costosa (p.ej. conteo de primos).
 * workerData contendrá el objeto { taskId, complexity, deviceId, etc. }.
 */
function tareaPesada(data) {
  const { taskId, complexity } = data;
  const limit = complexity || 50000;
  let countPrimes = 0;

  for (let num = 2; num <= limit; num++) {
    let esPrimo = true;
    for (let div = 2; div <= Math.sqrt(num); div++) {
      if (num % div === 0) {
        esPrimo = false;
        break;
      }
    }
    if (esPrimo) countPrimes++;
  }

  return { taskId, countPrimes, limit };
}

// 2) Ejecutar la función con el dato que llega desde workerData
const result = tareaPesada(workerData);

// 3) Enviar el resultado de vuelta al hilo principal
parentPort.postMessage(result);
