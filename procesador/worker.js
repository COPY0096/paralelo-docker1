// “TODO: implementar lógica”.const { parentPort, workerData } = require('worker_threads');

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

const result = tareaPesada(workerData);
parentPort.postMessage(result);
