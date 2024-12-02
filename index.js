// Importar Express
import mqtt from 'async-mqtt';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import fs from 'fs'
/********** refactoryn imports *********/
import express from 'express';
import cors from 'cors';
import { sendMqttMessage } from './services/sendMqttGeneric.js';
import { verifyTokken } from './services/generateTokken.js';
import { appendInFile } from './services/functionsGenerics.js'
import deviceRoutes from './routes/deviceRoute.js'





import WebSocket, { WebSocketServer } from 'ws';
import { InfluxDB } from '@influxdata/influxdb-client';

// Configuración de conexión
const url = 'https://us-central1-1.gcp.cloud2.influxdata.com/api/v2/query?bucket=UrbiCommBD&org=1cc07e3360f14fa4'; // Cambia esto a la URL de tu servidor InfluxDB
const token = 'u-gnlVuQE4K3WZXfZWVcRbNsfatzKQPBkHleQ_jZ7cLFtyKbcJ0z6T0_GzxM5F66f61LWYnBejp2fQYih5D4nw=='; // Reemplaza con tu token generado en InfluxDB
const org = '1cc07e3360f14fa4'; // Reemplaza con el nombre de tu organización
const bucket = 'UrbiCommBD'; // Reemplaza con el nombre de tu bucket
const query_params = 'Personas_Detectadas'
const device_uid = 'Franklin'

// Crear la instancia de conexión
const influxDB = new InfluxDB({ url, token });

// Crear una función para leer datos
// const readData = async () => {
//     const queryApi = influxDB.getQueryApi(org);

//     const fluxQuery = `
//     from(bucket: "${bucket}")
//         |> range(start: -1h)
//         |> filter(fn: (r) => r._measurement == "${device_uid}")
//         |> filter(fn: (r) => r._field == "${query_params}")
//         |> last()`;

//     console.log('Ejecutando consulta...');

//     // Ejecutar la consulta
//     queryApi.queryRows(fluxQuery, {
//         next(row, tableMeta) {
//             console.log(row);
//             const data = tableMeta.toObject(row);
//             console.log(data);
//             console.log(`Tiempo: ${data._time}, Valor: ${data._value}, Ubicación: ${data.deviceName}`);
//         },
//         error(error) {
//             console.error('Error al leer los datos:', error);
//         },
//         complete() {
//             console.log('Consulta completada.');
//         },
//     });
// };

// // Llama a la función para leer datos
// readData();

















































































































































































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

// Eliminamos el aviso de que frame utilizamos
app.disable('x-powered-by');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileSong = path.join(__dirname, 'songs-file.json');

// Definir el puerto para el servidor
const PORT = process.env.PORT || 3002;

// Ruta principal
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.log(error);
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

/****************************** NUEVAS RUTAS DEFINITIVAS ******************************/

// Ruta donde esperamos el fichero
app.post('/append-upload', verifyTokken, async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No se subió ningún archivo.' });
        }
        const uploadedFile = req.files.file;
        const file = uploadedFile.name.toLocaleLowerCase().replace(" ", "-") + ".mp3"
        const uploadPath = path.join(__dirname, 'uploads', file);
        uploadedFile.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: 'Archivo subido correctamente!' });
            appendInFile(fileSong, file, req.body.horaForm, req.body.diasForm)
        });
    } catch (error) {
        console.error(`Error recived file: ${error.stack}`);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error al mover el archivo', details: err });
        }
    }
})

// Ruta donde editamos una sola musica
app.post('/edit-upload/:id', verifyTokken, async (req, res) => {
    try {
        let response = {}
        fs.readFile(fileSong, 'utf-8', (err, data) => {
            if (err) {
                console.log("error al leer el fichero", err);
                return;
            }

            JSON.parse(data).forEach((element) => {
                if (element.id === req.params.id) {
                    response = {
                        "id": element.id,
                        "name": element.name,
                        "hora": element.hora,
                        "dias": element.dias
                    };
                }
            });

            if (response !== undefined) {
                res.json(response);
            }
        })
    } catch (error) {
        console.error(`Error recived file: ${error.stack}`);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error en datos del servidor', details: error });
        }
    }
})

// Ruta para eliminar musica en especifico
app.delete('/delete-upload/:id', verifyTokken, async (req, res) => {
    console.log("CON EL METODO DELETE");
    console.log(path.join(__dirname, 'uploads', req.body.name));
    console.log(req.params.id);
    res.json("id desde el backend: " + req.params.id + " el nombre es: " + req.body.name)
})

// Ruta donde realizamos la lectura de fichero musicas.json para obtener todas las canciones
app.get('/read-upload-music', verifyTokken, (req, res) => {
    const filesResponse = []
    try {
        fs.readFile(fileSong, 'utf-8', (err, data) => {
            if (err) {
                return res.status(400).json({ mensaje: "error al obtener datos del fichero" })
            }
            const response = JSON.parse(data)
            response.map((element, index) => {
                filesResponse.push(element)
                console.log(element);
            })

            if (filesResponse.length != 0) {
                res.json(filesResponse);
            }
        })
    } catch (error) {
        console.error(`Error recived file: ${error.stack}`);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Error en datos del servidor', details: error });
        }
    }
})

// Ruta donde recibimos audios
app.post('/audio', verifyTokken, async (req, res) => {
    console.log(req.body);
    try {
        const { command, file } = req.body;
        const body = {
            "command": `${command}`,
            "file": `${process.env.URL_SERVER}/uploads/${file.name}`
        };

        await sendMqttMessage(process.env.MQTT_DEVICE_AUDIO, body);

        // Responder al cliente una vez que se haya enviado el mensaje
        res.status(200).json({ message: 'Audio enviado correctamente' });

    } catch (error) {
        console.error(`Error: ${error.stack}`);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error al procesar la solicitud' });
        }
    }
})

// Ruta trigger sons de farolas
app.get('/time-song-trigger', verifyTokken, (req, res) => {
    try {
        fs.readFile(fileSong, 'utf-8', (err, data) => {
            if (err) {
                console.log("Error al leer el fichero", err);
                return;
            }
            const songFile = JSON.parse(data);
            res.json(songFile);
        })
    } catch (error) {
        console.error(`Error: ${error.stack}`);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    }
})

// Ruta para los colores
app.post('/lights', verifyTokken, async (req, res) => {
    try {
        const { red, green, blue, command } = req.body;
        console.log(`Red: ${red}, Green: ${green}, Blue: ${blue}`);

        // Configuración para la conexión MQTT
        const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
        const username = process.env.MQTT_USERNAME;
        const password = process.env.MQTT_PASSWORD;
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
            "state": command,
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

/******************+ NUEVA FUNCIONALIDAD PARA API REST FULL +***************/
// Desplegamos nueva logica con separacion de funciones
app.use('/devices', deviceRoutes)

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});


console.log(server);

// console.log(app);



const wss = new WebSocketServer({ server, path: '/ws' });

console.log('BBBBBBBBBBBBBBBBBServidor WebSocket iniciado en el path:', wss.options.path);
// console.log(`${wss.path}`);


// console.log(wss);

wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket.');

  // Envía datos desde InfluxDB al cliente
  const sendData = async () => {
    const queryApi = influxDB.getQueryApi(org);

    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -2h)
      |> filter(fn: (r) => r._measurement == "Franklin")
      |> filter(fn: (r) => r._field == "Personas_Detectadas")
  `;

    console.log('Ejecutando consulta...');

    // Ejecutar la consulta
    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const data = tableMeta.toObject(row);

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

  // Maneja la desconexión del cliente
  ws.on('close', () => {
    console.log('Cliente desconectado del WebSocket.');
  });
});
