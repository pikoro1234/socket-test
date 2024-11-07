// Importar Express
import express from 'express';
import mqtt from 'async-mqtt';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import fs from 'fs'
import { sendMqttMessage } from './services/sendMqttGeneric.js';

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

// Midelware para leer ficheros
app.use(fileUpload());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir el puerto para el servidor
const PORT = process.env.PORT || 3000;

// Ruta principal
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.log(error);
        // console.error(`Error: ${e.stack}`);
        res.status(500).json({ error: 'Error en levantar el server en la ruta especifica' });
    }
});

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
app.get('/prueba', async (req, res) => {
    try {
        res.json({ mensaje: "hola mundo V.1.1" });
    } catch (error) {
        console.log(error);
        // console.error(`Error: ${e.stack}`);
        res.status(500).json({ error: 'Error en levantar el server en la ruta especifica' });
    }
});

// Ruta para los colores
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

// Ruta donde esperamos el fichero
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No se subió ningún archivo.' });
        }

        const uploadedFile = req.files.file;
        const file = uploadedFile.name.toLocaleLowerCase().replace(" ", "-") + ".mp3"
        const uploadPath = path.join(__dirname, 'uploads', file);
        uploadedFile.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);
            // await sendMqttMessage("topic","mensaje");
            // res.json({ message: 'Archivo subido correctamente!' });

            // Llama a la función MQTT después de subir el archivo
            // const result = await sendMqttMessage('mi/topic', 'Archivo subido: ');
            // if (result.success) {
            //     console.log("verda");
            //     res.json({ message: 'Archivo subido correctamente y mensaje MQTT enviado' });
            // } else {
            //     console.log("falso");
            //     res.status(500).json({ message: 'Archivo subido, pero ocurrió un error al enviar mensaje MQTT', error: result.error });
            // }
        });
    } catch (error) {
        console.error(`Error recived file: ${error.stack}`);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al mover el archivo', details: err });
        }
    }
})

// Ruta donde realizamos la lectura de directorio para obtener los ficheros 
app.get('/read-uploads', (req, res) => {
    const uploadsPath = path.join(__dirname, 'uploads');
    const filesResponse = []
    fs.readdir(uploadsPath, (err, files) => {
        if (err) {
            return res.status(400).json({ mensaje: "error al leer el directorio", content: filesResponse })
        } else {
            try {
                files.map(file => {
                    filesResponse.push(file)
                    console.log(file);
                })
                return res.status(200).json({ mensaje: "ficheros enviados", content: filesResponse })
            } catch (error) {
                return res.status(404).json({ mensaje: "error al leer los ficheros", content: filesResponse })
            }
        }
    })
})


/****************************** NUEVAS RUTAS DEFINITIVAS ******************************/

// Ruta donde recibimos audios estaticos
app.post('/audio', async (req, res) => {

    try {
        const { command, file } = req.body;
        const body = {
            "command": `${command}`,
            // "file": `${file}.mp3`
            "file": "https://urbicomm.io/urbidata/uploads/test-hola.mp3"
        };
        sendMqttMessage(process.env.MQTT_DEVICE_AUDIO,body);

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


// https://urbicomm.io/urbidata/uploads/test-hola.mp3