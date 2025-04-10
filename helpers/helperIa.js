import mqtt from 'async-mqtt';
import { mqtt_uri_local, temp_prompt, temp_key, temp_response } from '../no-trackin.js';

export const publish_my_data_agent = () => {

    return new Promise((resolve, reject) => {
        const client = mqtt.connect(mqtt_uri_local);
        const data = temp_key
        client.on("connect", () => {
            client.publish("/user_login", data, (err) => {
                if (err) {
                    client.end();
                    return reject({ status: "error", message: "Error enviando mensaje a MQTT" });
                }
                console.log("Mensaje enviado a broker:",);
            });
        })
    })
}


export async function chatAgentToClient(prompt) {

    console.log(prompt);
    return new Promise((resolve, reject) => {
        const client = mqtt.connect(mqtt_uri_local);
        let lastResponse = null;
        const query = JSON.stringify({ "prompt": prompt })

        client.on("connect", () => {
            console.log("Conectado a MQTT");

            // Esperar respuesta
            client.subscribe(temp_response, (err) => {
                if (err) {
                    client.end();
                    console.log(err);
                    return reject({ status: "error", message: "Error al suscribirse al topic de respuesta" })
                }
            })

            // Enviar consulta
            console.log(`temp_prompt  ${temp_prompt}`);
            client.publish(temp_prompt, query, (err) => {
                if (err) {
                    client.end();
                    return reject({ status: "error", message: "Error enviando mensaje a MQTT" });
                }
                console.log("Mensaje enviado a broker:", prompt);
            });
        });

        console.log(`temp_response ${temp_response}`);
        // Escuchar respuesta del modelo
        client.on("message", (topic, message) => {
            console.log(topic);
            if (topic === temp_response) {
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