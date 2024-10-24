// Importar Express
import express from 'express';
import mqtt from 'async-mqtt';
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';

// Cargar las variables de entorno
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'),
});

// Inicializar la aplicación Express
const app = express();

// Middleware para analizar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Permitir CORS para todas las rutas
app.use(cors());

// Definir el puerto para el servidor
const PORT = process.env.PORT || 3000;

// Ruta principal
app.get('/prueba', async (req, res) => {
    try {
        res.json({ mensaje: "hola mundo V.0" });
    } catch (error) {
        console.log(error);
        // console.error(`Error: ${e.stack}`);
        res.status(500).json({ error: 'Error en levantar el server en la ruta especifica' });
    }
});


app.post('/franklin', async (req, res) => {
    try {
        const { red, green, blue } = req.body;

        console.log(`Red: ${red}, Green: ${green}, Blue: ${blue}`);

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
                "r": red,
                "g": green,
                "b": blue
            },
            "effect": "none",
            "brightness": 255
        };

        // Conectar al broker MQTT y publicar el mensaje
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
        console.log(`Successfully published message to broker ${mqttBrokerUrl}`);

        // Cerrar la conexión
        await client.end();

        // Responder al cliente con éxito
        if (!res.headersSent) {
            res.json({ message: 'Datos de los colores publicados en MQTT correctamente' });
        }

    } catch (error) {
        console.error(`Error: ${error.stack}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    }
})

app.post('/audio', async (req, res) => {
    try {
        const { command, file } = req.body;

        console.log(`commando: ${command}, file: ${file}`);

        // Configuración para la conexión MQTT
        const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
        const username = process.env.MQTT_USERNAME;
        const password = process.env.MQTT_PASSWOR;
        const deviceId = process.env.MQTT_DEVICE_AUDIO;
        const topic = `${deviceId}`;

        var options = {
            connectTimeout: 5 * 1000,
            reconnectPeriod: 0,
            clientId: "akenza-example",
            username: username,
            password: password,
        };

        const body = {
            "command": command,
            "file": `${file}.mp3`
        };

        // Conectar al broker MQTT y publicar el mensaje
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
        console.log(`Successfully published message to broker ${mqttBrokerUrl}`);

        // Cerrar la conexión
        await client.end();

        // Responder al cliente con éxito
        if (!res.headersSent) {
            res.json({ message: 'Datos del audio recibidos y publicados en MQTT correctamente' });
        }

    } catch (error) {
        console.error(`Error: ${error.stack}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    }
})
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
