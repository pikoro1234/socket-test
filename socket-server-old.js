import { WebSocketServer } from 'ws';
import https from 'https';
import fs from 'fs';
import { config } from 'dotenv';
import path from 'path';
import { InfluxDB } from '@influxdata/influxdb-client';

config({
  path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'),
});


// Certificados SSL
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const sslOptions = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
};

// Crear un servidor HTTPS
const httpsServer = https.createServer(sslOptions);

// Crear el servidor WebSocket seguro (wss)
const wss = new WebSocketServer({ server: httpsServer });

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado.');

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);


    const url = 'https://us-central1-1.gcp.cloud2.influxdata.com/api/v2/query?bucket=UrbiCommBD&org=1cc07e3360f14fa4'; // Cambia esto a la URL de tu servidor InfluxDB
    const token = 'u-gnlVuQE4K3WZXfZWVcRbNsfatzKQPBkHleQ_jZ7cLFtyKbcJ0z6T0_GzxM5F66f61LWYnBejp2fQYih5D4nw=='; // Reemplaza con tu token generado en InfluxDB
    const org = '1cc07e3360f14fa4'; // Reemplaza con el nombre de tu organización
    const bucket = 'UrbiCommBD'; // Reemplaza con el nombre de tu bucket
    const query_params = 'Personas_Detectadas'
    const device_uid = 'Franklin'

    // Crear la instancia de conexión
    const influxDB = new InfluxDB({ url, token });

    // Envía datos desde InfluxDB al cliente
    const sendData = async () => {
      const queryApi = influxDB.getQueryApi(org);

      const fluxQuery = `
        from(bucket: "${bucket}")
          |> range(start: -2h)
          |> filter(fn: (r) => r._measurement == "Franklin")
          |> filter(fn: (r) => r._field == "Personas_Detectadas")`;

      console.log('Ejecutando consulta...');

      // Ejecutar la consulta
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const data = tableMeta.toObject(row);
          console.log(data);
          // Envía cada dato al cliente conectado
          ws.send(
            JSON.stringify({
              time: data._time,
              value: data._value,
              deviceName: data.deviceName || 'Unknown',
            })
          );
        },
        error(error) {
          console.error('Error al leer los datos:', error);
        },
        complete() {
          console.log('Consulta completada.');
        },
      });
    };

    // Llama a la función para enviar datos
    sendData();














    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});

// Iniciar el servidor HTTPS
httpsServer.listen(process.env.PORT_SOCKET, () => {
  console.log(`Servidor WebSocket seguro escuchando en https://localhost:${process.env.PORT_SOCKET}`);
});
