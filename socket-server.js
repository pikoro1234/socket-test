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
const readData = async () => {
    const queryApi = influxDB.getQueryApi(org);

    const fluxQuery = `
    from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "${device_uid}")
        |> filter(fn: (r) => r._field == "${query_params}")
        |> last()`;

    console.log('Ejecutando consulta...');

    // Ejecutar la consulta
    queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
            console.log(row);
            const data = tableMeta.toObject(row);
            console.log(data);
            console.log(`Tiempo: ${data._time}, Valor: ${data._value}, Ubicación: ${data.deviceName}`);
        },
        error(error) {
            console.error('Error al leer los datos:', error);
        },
        complete() {
            console.log('Consulta completada.');
        },
    });
};

// Llama a la función para leer datos
readData();