// Importar Express
import mqtt from 'async-mqtt';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import fs from 'fs';
/********** refactoryn imports *********/
import express from 'express';
import cors from 'cors';
import { sendMqttMessage } from './services/sendMqttGeneric.js';
import { verifyTokken } from './services/generateTokken.js';
import { appendInFile } from './services/functionsGenerics.js';
import deviceRoutes from './routes/deviceRoute.js';
import deviceDataRoutes from './routes/deviceDataRoute.js';

// importaciones para generar documentacion
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import { CLIENT_RENEG_WINDOW } from 'tls';





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
    let deviceId = '';
    try {
        const { command, file } = req.body;
        const body = {
            "command": `${command}`,
            "file": `${process.env.URL_SERVER}/uploads/${file.name}`
        };

        if (req.body.typeDevice === 'Franklin') {
            deviceId = process.env.MQTT_DEVICE_AUDIO_F3;
        } else {
            deviceId = process.env.MQTT_DEVICE_AUDIO_F4;
        }

        await sendMqttMessage(deviceId, body);

        // Responder al cliente una vez que se haya enviado el mensaje
        res.status(200).json({ message: 'Audio enviado correctamente' });

    } catch (error) {
        console.error(`Error: ${error.stack}`);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error al procesar la solicitud' });
        }
    }
})


//**************************************************************** */
const query_data = async (id_device) => {
    try {
        const response = await fetch(`https://api.akenza.io/v3/devices/by-device-id?deviceId=${id_device}A`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.X_API_KEY
            }
        })
        if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }
        const result = await response.json();
        return result

    } catch (error) {
        console.error('Error en obtener datos de los workspace:', error.message);
        throw error;
    }
}

const mqttMessageEnvio = async (username, password, port, topic, msg) => {
    try {
        // Opciones para la conexion
        const options = {
            connectTimeout: 5 * 1000,
            reconnectPeriod: 5000,
            // clientId: "01234566-123455asr-22sfff",
            clientId: `client_${Math.random().toString(16).slice(2)}`,
            username: username,
            password: password,
        }

        // Configuracion de conexion a broker
        const client = await mqtt.connectAsync(
            `tls://${process.env.MQTT_BROKER_URL}:8883`,
            options,
            false
        )

        // Manejar errores de conexión
        client.on('error', (err) => {
            console.log(`Error al enviar los datos a broker: ${err}`);
        });

        // Publicar el mensaje en el topic
        await client.publish(topic, JSON.stringify(msg));

        // Cerrar la conexión
        await client.end();

    } catch (error) {
        console.error(`Error: ${error.stack}`);
        console.error(`ErrorComplet: ${error}`);
    }
}

app.post('/save-data-device', verifyTokken, async (req, res) => {
    if (req.body.value[ 0 ]) {
        const response = await query_data(req.body.id_device)
        response.customFields.map(async (value, index) => {
            if (value.meta.name === 'Config') {
                if (req.body.key === 'status') {
                    let mqtt_usr = value.JSON.mqtt.user
                    let mqtt_psw = value.JSON.mqtt.psw
                    let mqtt_port = value.JSON.mqtt.port
                    let mqtt_topic = value.JSON.mqtt.uplink_topic
                    let msg = {
                        "puerta": ((req.body.value[ 0 ].status.door_open) || (req.body.value[ 0 ].status.door_open === 'true')) ? 1 : 0,
                        "vPannel": req.body.value[ 0 ].status.vpv,
                        "tiempo": req.body.value[ 0 ].status.ts,
                        "vBatt": req.body.value[ 0 ].status.vbatt,
                        "temperatura": req.body.value[ 0 ].status.soil_temperature_c,
                        "humedad": req.body.value[ 0 ].status.soil_moisture_vwc,
                        "agua": ((req.body.value[ 0 ].status.level_low) || (req.body.value[ 0 ].status.level_low === 'true')) ? 1 : 0,
                        "id_sensor_status": req.body.value[ 0 ].id
                    }
                    mqttMessageEnvio(mqtt_usr, mqtt_psw, mqtt_port, mqtt_topic + "/status", msg)
                    res.status(200).json(req.body.value[ 0 ]);
                } else if (req.body.key === 'events') {
                    let mqtt_usr = value.JSON.mqtt.user
                    let mqtt_psw = value.JSON.mqtt.psw
                    let mqtt_port = value.JSON.mqtt.port
                    let mqtt_topic = value.JSON.mqtt.uplink_topic
                    req.body.value.map((element, index) => {
                        let msg = {
                            "timeStamp": element.ts,
                            "idSensor": element.id,
                            "idevent": element.idevent,
                            "value": element.value,
                            "extradata": element.extradata
                        }
                        mqttMessageEnvio(mqtt_usr, mqtt_psw, mqtt_port, mqtt_topic + "/events", msg)
                    })
                    res.status(200).json({ "result": true, "reason": null });
                } else if (req.body.key === 'irrigations') {
                    let mqtt_usr = value.JSON.mqtt.user
                    let mqtt_psw = value.JSON.mqtt.psw
                    let mqtt_port = value.JSON.mqtt.port
                    let mqtt_topic = value.JSON.mqtt.uplink_topic
                    req.body.value.map((element, index) => {
                        let msg = {
                            "idSensor": req.body.id_device,
                            "irrigationId": element.irrigationid,
                            "start": element.start,
                            "end": element.end,
                            "duration": element.duration,
                            "vBatt": element.vbatt,
                            "vPump": element.vpump,
                            "iPump": element.ipump,
                            "initial_sm_vwc": element.initial_sm_vwc,
                            "final_sm_vwc": element.final_sm_vwc,

                        }
                        mqttMessageEnvio(mqtt_usr, mqtt_psw, mqtt_port, mqtt_topic + "/irrigations", msg)
                    })
                    res.status(200).json({ "result": true, "reason": null });
                } else if (req.body.key === 'canceled_irrigations') {
                    let mqtt_usr = value.JSON.mqtt.user
                    let mqtt_psw = value.JSON.mqtt.psw
                    let mqtt_port = value.JSON.mqtt.port
                    let mqtt_topic = value.JSON.mqtt.uplink_topic
                    req.body.value.map((element, index) => {
                        let msg = {
                            "idSensor": req.body.id_device,
                            "textReason": req.body.text_reason,
                            "valueReason": req.body.value_reason,
                            "humedad": element.status.soil_moisture_vwc,
                            "temperatura": element.status.soil_temperature_c,
                            "vBatt": element.status.vbatt,
                            "vPannel": element.status.vpv,
                        }
                        console.log(msg);
                        mqttMessageEnvio(mqtt_usr, mqtt_psw, mqtt_port, mqtt_topic + "/canceled_irrigations", msg)
                    })
                    res.status(200).json({ "result": true, "reason": null });
                }
            }
        })
    }
})

app.post('/get-data-device', verifyTokken, async (req, res) => {
    try {
        const response = await fetch(`https://api.akenza.io/v3/devices/by-device-id?deviceId=${req.body.id_device}A`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.X_API_KEY
            }
        })
        if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }
        const result = await response.json();

        if (req.body.query_string === 'coordenadas') {
            result.customFields.map((value, index) => {
                if (value.meta.name === 'Cordenadas') {
                    console.log(value);
                    res.status(200).json(value.GPS_COORDINATES);
                }
            })
        } else if (req.body.query_string === 'params') {
            result.customFields.map((value, index) => {
                if (value.meta.name === 'Params') {
                    console.log(value.JSON);
                    res.status(200).json(value.JSON);
                }
            })
        } else if (req.body.query_string === 'config') {
            result.customFields.map((value, index) => {
                if (value.meta.name === 'Config') {
                    console.log(value.JSON);
                    res.status(200).json(value.JSON);
                }
            })
        } else {
            res.status(200).json(result);
        }

    } catch (error) {
        console.error('Error en obtener datos de los workspace:', error.message);
        throw error;
    }
})

app.post('/get-city-code', verifyTokken, async (req, res) => {
    let obj_response = { "rainMillimeter": null, "rainProbability": null }
    try {
        const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=URwZc0quyomWgM6icmitYSl5sl2MRJQi&q=${req.body.latitude},${req.body.longitude}&language=es-ES&details=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }
        const result = await response.json();

        const data_response = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${result.Details.Key}?apikey=URwZc0quyomWgM6icmitYSl5sl2MRJQi&language=es-ES&details=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!data_response.ok) { throw new Error(`Error con la API : ${data_response.statusText}`); }
        const values_api = await data_response.json();
        const currentDate = new Date();
        const currentHour = currentDate.getHours(); // Obtenemos la hora en formato 24h para poder acceder a key Day/Night
        if (currentHour >= 17) {
            obj_response = {
                "rainMillimeter": parseFloat(values_api.DailyForecasts[ 1 ].Night.Rain.Value) * 25.4,
                "rainProbability": values_api.DailyForecasts[ 1 ].Night.RainProbability
            }
        } else {
            obj_response = {
                "rainMillimeter": parseFloat(values_api.DailyForecasts[ 1 ].Day.Rain.Value) * 25.4,
                "rainProbability": values_api.DailyForecasts[ 1 ].Day.RainProbability
            }
        }

    } catch (error) {
        console.error('Error en obtener datos de los workspace:', error.message);
        throw error;
    }
    res.status(200).json(obj_response);
})
//**************************************************************** */

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
    console.log(req.body);
    let username = '';
    let password = '';
    let deviceId = '';
    try {
        const { red, green, blue, command } = req.body;
        console.log(`Red: ${red}, Green: ${green}, Blue: ${blue}`);

        if (req.body.typeDevice === 'Franklin') {
            username = process.env.MQTT_USERNAME_F4;
            password = process.env.MQTT_PASSWORD_F4;
            deviceId = process.env.MQTT_DEVICE_ID_F4;
        } else {
            username = process.env.MQTT_USERNAME_F3;
            password = process.env.MQTT_PASSWORD_F3;
            deviceId = process.env.MQTT_DEVICE_ID_F3;
        }

        // Configuración para la conexión MQTT
        const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
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

// ruta principal donde desplegamos todo lo visible en Urbicomm.io
app.get('/', async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error en levantar la pagina principal' });
    }
});

// ruta donde presentaremos nuesta documentacion generadapor swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// obtenemos workspace/devices-for-workspace/config-params-device
app.use('/devices', verifyTokken, deviceRoutes);

// obtenemos los datos de influxDB
app.use('/data-device', deviceDataRoutes);

// validacion y control del login MYQL/MONGO,etc
app.post('/login', (req, res) => {
    try {
        if (!req.body.username) {
            res.status(404).json({ message: 'User/Password Not Found' });
        }

        if (!req.body.userpassword) {
            res.status(404).json({ message: 'User/Password Not Found' });
        }

        res.status(200).json({ message: 'login correct' })
    } catch (error) {
        console.log("error en la logica del login");
        console.log(error);
    }
})

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});