import { WebSocketServer } from 'ws';
import https from 'https';
import fs from 'fs';

// Certificados SSL
const SSL_KEY_PATH = '/home/adminweb/cert.key';
const SSL_CERT_PATH = '/home/adminweb/cert.pem';

const sslOptions = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
};

// Crear un servidor HTTPS
const httpsServer = https.createServer(sslOptions);

// Crear el servidor WebSocket seguro (wss)
const wss = new WebSocketServer({ server: httpsServer });

// Puerto del servidor
const PORT = 8080;

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado.');

  ws.on('message', (message) => {
    console.log('Mensaje recibido:', message);
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});

// Iniciar el servidor HTTPS
httpsServer.listen(PORT, () => {
  console.log(`Servidor WebSocket seguro escuchando en https://localhost:${PORT}`);
});
