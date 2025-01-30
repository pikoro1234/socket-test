// import WebSocket from 'ws';

// const ws = new WebSocket('wss://urbicomm.io/ws', {
//     rejectUnauthorized: false, // Desactiva la verificación de certificados
//   });
  
//   ws.onopen = () => {
//     console.log('Conexión abierta.');
//     ws.send('Hola servidor WebSocket');
//   };
  
//   ws.onmessage = (event) => {
//     console.log('Mensaje recibido:', event);
//   };
  
//   ws.onclose = () => {
//     console.log('Conexión cerrada.');
//   };
  
//   ws.onerror = (error) => {
//     console.error('Error en WebSocket:', error);
//   };
  

// import WebSocket from "ws";

// // URL del WebSocket al que te quieres conectar
// const wsUrl = "ws://urbicomm.io:8080"; // Cambia a la URL correspondiente (puede ser wss://urbicomm.io/ws si es seguro)

// const ws = new WebSocket(wsUrl);

// // Evento: Conexión abierta
// ws.on("open", () => {
//   console.log("Conexión al WebSocket abierta.");

//   // Si necesitas enviar un mensaje al conectarte
//   ws.send("Hola servidor WebSocket, estoy conectado.");
// });

// // Evento: Mensaje recibido del servidor
// ws.on("message", (data) => {
//   console.log("Mensaje recibido desde el WebSocket:", JSON.parse(data));
// });

// // Evento: Conexión cerrada
// ws.on("close", (code, reason) => {
//   console.log(`Conexión cerrada. Código: ${code}, Razón: ${reason}`);
// });

// // Evento: Error en la conexión
// ws.on("error", (error) => {
//   console.error("Error en la conexión WebSocket:", error);
// });


// import { WebSocketServer } from "ws";

// const wss = new WebSocketServer({ port: 8080 }); // 🚀 Servidor en el puerto 8081

// wss.on("connection", (ws) => {
//     console.log("🌍 Cliente conectado al WebSocket");

//     ws.on("message", (message) => {
//         console.log("📨 Mensaje recibido:", message.toString());
//         ws.send(`📩 Respuesta desde el servidor: ${message.toString()}`);
//     });

//     ws.on("close", () => {
//         console.log("❌ Cliente WebSocket desconectado");
//     });
// });

// console.log("🚀 Servidor WebSocket corriendo en ws://localhost:8081");
