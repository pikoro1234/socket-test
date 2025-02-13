/**
 * Example to send an uplink via MQTT using TLS for a device.
 */
import mqtt from "async-mqtt";
import { config } from "dotenv";
import path from "path";
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), ".env"),
});

const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
const username = "07255b7857c33575";
const password = "4v1bpt5ff72v3vp35k8h7lupj6fqj8gl";
const deviceId = "930969E35F535D1F";
const topic = `/up/${password}/id/${deviceId}/#`;

const options = {
    connectTimeout: 5000,
    reconnectPeriod: 1000, // Intenta reconectar cada 1s si hay desconexión
    clientId: `akenza-client-${Math.random().toString(16).substr(2, 8)}`,
    username: username,
    password: password,
};

async function connectMqtt() {
    try {
        console.log("🔌 Conectando a MQTT Broker...");
        const client = await mqtt.connectAsync(`tls://${mqttBrokerUrl}:8883`, options);

        console.log("✅ Conectado a MQTT Broker!");

        // ✅ Suscribirse al topic para recibir datos
        await client.subscribe(topic);
        console.log(`📡 Suscrito al topic: ${topic}`);

        // 📩 Escuchar los mensajes que llegan al topic
        client.on("message", (receivedTopic, message) => {
            console.log(`📩 Mensaje recibido en ${receivedTopic}:`, message.toString());
        });

        // ✅ Publicar un mensaje de prueba
        const body = { co2: 780 };
        await client.publish(topic, JSON.stringify(body));
        console.log(`✅ Mensaje publicado en ${topic}:`, body);

        return client;
    } catch (error) {
        console.error("❌ Error al conectar a MQTT:", error);
    }
}

// Iniciar la conexión MQTT
connectMqtt();