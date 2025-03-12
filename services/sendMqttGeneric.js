import mqtt from 'async-mqtt';
import { config } from 'dotenv';
import path from 'path';
config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'), });

export async function sendMqttMessage(topic, msg) {
    try {
        // Opciones para la conexion
        const options = {
            connectTimeout: 5 * 1000,
            reconnectPeriod: 0,
            clientId: "01234566-123455asr-22sfff",
            username: process.env.MQTT_USERNAME_F3,
            password: process.env.MQTT_PASSWORD_F3,
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

export async function sendMqttPrompt(prompt) {
    return new Promise((resolve, reject) => {
        const client = mqtt.connect(process.env.MQTT_BROKER_LOCAL);
        let lastResponse = null;
        const query = JSON.stringify({ "prompt": prompt })

        client.on("connect", () => {
            console.log("Conectado a MQTT");

            // Esperar respuesta
            client.subscribe("/model_response", (err) => {
                if (err) {
                    client.end();
                    console.log(err);
                    return reject({ status: "error", message: "Error al suscribirse al topic de respuesta" })
                }
            })

            // Enviar consulta
            client.publish("/prompt", query, (err) => {
                if (err) {
                    client.end();
                    return reject({ status: "error", message: "Error enviando mensaje a MQTT" });
                }
                console.log("Mensaje enviado a broker:", prompt);
            });
            // });
        });

        // Escuchar respuesta del modelo
        client.on("message", (topic, message) => {
            if (topic === process.env.MQTT_BROKER_LOCAL_RESPONSE) {
                lastResponse = message.toString();
                console.log("Respuesta recibida:", lastResponse);
                try {
                    const parsedMessage = JSON.parse(lastResponse);
                    resolve({ status: "success", data: parsedMessage });
                } catch (error) {
                    resolve({ status: "error", message: "Respuesta inválida de MQTT" });
                }
                client.end();
            }
        });

        // Timeout si no hay respuesta en 20 segundos
        setTimeout(() => {
            if (!lastResponse) {
                console.log("Timeout: No se recibió respuesta");
                client.end();
                reject({ status: "timeout", message: "No se recibió respuesta vuelve a intentarlo" });
            }
        }, 50000);
    });
}