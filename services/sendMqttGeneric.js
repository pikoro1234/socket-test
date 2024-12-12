import mqtt from 'async-mqtt';

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