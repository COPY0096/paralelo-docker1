Verifica que los contenedores estén corriendo:
docker ps

Verifica red y comunicación entre contenedores (por ejemplo, desde un contenedor alpine):

docker run -it --network=paralelo-docker1_default alpine sh
# Luego, dentro del contenedor
apk add curl
curl http://procesador1:3000/health
✔️ Demuestra: Todos los microservicios están corriendo y accesibles dentro de la red Docker.

Balanceador Nginx
Verifica que Nginx balancee correctamente:
curl http://localhost:80/health
✔️ Demuestra: El balanceador redirige correctamente a uno de los procesadorX.
Opcional para ver logs del balanceador:
docker logs nginx

Distribución de tareas entre procesadores
Ejecuta varias veces para ver distribución:
curl -X POST http://localhost/procesar \
  -H "Content-Type: application/json" \
  -d '{"taskId":"T1","deviceId":"D1","complexity":10000}'

Y otra:
curl -X POST http://localhost/procesar \
  -H "Content-Type: application/json" \
  -d '{"taskId":"T2","deviceId":"D2","complexity":15000}'
✔️ Demuestra: Cada solicitud se distribuye a uno de los procesadorX gracias al upstream de Nginx.

Notificaciones
Verifica que el notificador recibe solicitudes:
docker logs notificador
✔️ Demuestra: El procesador envía notificación al notificador tras terminar la tarea.

Balanceador de Carga AWS (ALB)
Prueba desde tu máquina el acceso público al ALB:

curl -X POST http://alb-procesador-111030566.us-east-1.elb.amazonaws.com/procesar \
  -H "Content-Type: application/json" \
  -d '{"taskId":"T3","deviceId":"D3","complexity":50000}'
✔️ Demuestra: API Gateway expone el servicio final a Internet de forma segura con HTTPS.

------------------------------------------------------------------------------------
DOCKER COMPROVACIONES

docker-compose up --build

docker ps

curl -X POST http://localhost:3001/api/facturar \
  -H 'Content-Type: application/json' \
  -d '{"taskId":"T1","deviceId":"D123","complexity":50000}'

docker logs -f procesador1
docker logs -f procesador2
docker logs -f procesador3
docker logs -f notificador

cd test-script
URL_API_GATEWAY=http://localhost:3001/api/facturar TOTAL_REQUESTS=30 COMPLEXITY=100000 npm start


docker logs api-gateway
------------------------------------------------------------------------------------
DOCKER REINICIAR CONTENEDORES

docker-compose down

docker-compose up --build -d

docker-compose build procesador1 procesador2 procesador3
docker-compose up -d

docker logs -f procesador1



POSTMAN

curl -X POST http://localhost:3001/api/facturar \
  -H 'Content-Type: application/json' \
  -d '{"taskId":"T1","deviceId":"D123","complexity":50000}'



cd test-script
URL_API_GATEWAY=http://localhost:3001/api/facturar TOTAL_REQUESTS=30 COMPLEXITY=80000 npm start


docker logs -f nginx


cd test-script
URL_API_GATEWAY=http://localhost:3001/api/facturar \
  TOTAL_REQUESTS=50 \
  COMPLEXITY=120000 \
  npm start
