import mqtt from 'async-mqtt';
import { mqtt_uri_local } from '../no-trackin.js';
import { createQueryChatDb } from '../models/iA/iAModel.js';

export const publish_my_data_agent = (topicUser, dataUser) => {

    return new Promise((resolve, reject) => {

        const client = mqtt.connect(mqtt_uri_local);
        const data = dataUser

        client.on("connect", () => {

            client.publish(topicUser, data, (err) => {

                if (err) {
                    client.end();
                    return reject({ success: false, status: "error", message: "Error enviando mensaje a MQTT" });
                }

                client.end();
                resolve({ success: true, status: "ok", message: "Conect al broker con exitó." });
            });
        })
    })
}

export async function chatAgentToClient(dataUser, topicUser, prompt) {

    return new Promise((resolve, reject) => {

        const client = mqtt.connect(mqtt_uri_local);
        let lastResponse = null;
        const query = JSON.stringify({ "prompt": prompt })

        client.on("connect", () => {
            console.log("Estamos conectados MQTT");

            // Esperar respuesta
            client.subscribe(`/model_response${topicUser}`, (err) => {

                if (err) {
                    client.end();
                    console.log(err);
                    return reject({ success: false, status: "error", message: "Error al suscribirse al topic de respuesta" })
                }
            })

            // Enviar consulta
            client.publish(`/prompt${topicUser}`, query, (err) => {

                if (err) {
                    client.end();
                    return reject({ success: false, status: "error", message: "Error enviando mensaje a MQTT" });
                }
                console.log("Mensaje enviado a broker:", JSON.parse(query).prompt);
            });
        });

        // Escuchar respuesta del modelo
        client.on("message", (topic, message) => {

            if (topic === `/model_response${topicUser}`) {

                lastResponse = message.toString();
                console.log("Respuesta recibida:", lastResponse);

                try {

                    const parsedMessage = JSON.parse(lastResponse);
                    console.log(parsedMessage);
                    if (parsedMessage.error) {

                        resolve({ success: false, status: "error", data: parsedMessage.error });
                    } else {

                        createQueryChatDb(dataUser, JSON.parse(query).prompt);
                        resolve({ success: true, status: "success", data: parsedMessage });
                    }

                } catch (error) {
                    resolve({ success: false, status: "error", message: "Respuesta inválida de MQTT" });
                }
                client.end();
            }
        });

        // Timeout si no hay respuesta en 20 segundos
        setTimeout(() => {

            if (!lastResponse) {

                console.log("Timeout: No se recibió respuesta");
                client.end();
                reject({ success: false, status: "timeout", message: "No se recibió respuesta vuelve a intentarlo" });
            }
        }, 50000);
    });
}