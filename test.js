import WebSocket from 'ws';

const ws = new WebSocket('wss://urbicomm.io/ws', {
    rejectUnauthorized: false, // Desactiva la verificación de certificados
  });
  
  ws.onopen = () => {
    console.log('Conexión abierta.');
    ws.send('Hola servidor WebSocket');
  };
  
  ws.onmessage = (event) => {
    console.log('Mensaje recibido:', event.data);
  };
  
  ws.onclose = () => {
    console.log('Conexión cerrada.');
  };
  
  ws.onerror = (error) => {
    console.error('Error en WebSocket:', error);
  };
  