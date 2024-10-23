// Importar Express
import express from 'express';
import mqtt from 'async-mqtt';
import { config } from 'dotenv';
import path from 'path';

// Cargar las variables de entorno
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'),
});

// Inicializar la aplicación Express
const app = express();

// Definir el puerto para el servidor
const PORT = 3000;

// Ruta principal
app.get('/prueba', async (req, res) => {
    console.log(req);

    console.log("valor de la variable"+ process.env.MQTT_BROKER_URL);

    // Responder con un mensaje
    res.json({ mensaje: "mundo" });

    // Configuración para la conexión MQTT
    const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
    const username = process.env.MQTT_USERNAME;
    const password = process.env.MQTT_PASSWOR;
    const deviceId = process.env.MQTT_DEVICE_ID;
    const topic = `${deviceId}`;

    var options = {
        connectTimeout: 5 * 1000,
        reconnectPeriod: 0,
        clientId: "akenza-example",
        username: username,
        password: password,
    };

    const body = {
        "state": "ON",
        "color": {
            "r": 255,
            "g": 0,
            "b": 0
        },
        "effect": "none",
        "brightness": 255
    };

    try {
        // Conectar al broker MQTT
        const client = await mqtt.connectAsync(
            `tls://${mqttBrokerUrl}:8883`,
            options,
            false
        );

        // Manejar errores de conexión
        client.on('error', (err) => {
            console.log(`Error while sending data to MQTT broker: ${err}`);
        });

        // Publicar el mensaje en el topic
        await client.publish(topic, JSON.stringify(body));
        console.log(`Successfully published message to broker ${mqttBrokerUrl} for user ${username}`);

        // Cerrar la conexión
        await client.end();
    } catch (e) {
        console.error(`Error: ${e.stack}`);
        res.status(500).json({ error: 'Error al publicar en MQTT' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
