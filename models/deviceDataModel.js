import { InfluxDB } from '@influxdata/influxdb-client';
import { config } from 'dotenv';
import path from 'path';

// Cargar las variables de entorno
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env.vars'),
});

// obtener datos solana/franklin/basic desde --> API/influx
export const fetchDataModelDevices = async (queryApi, bucket, startDate, endDate, querySet, deviceId) => {
    const response = [];
    return new Promise((resolve, reject) => {
        const fluxQuery = `from(bucket: "${bucket}")
        |> range(start: ${startDate}, stop: ${endDate})
        |> filter(fn: (r) => r._measurement == "${querySet}")
        |> filter(fn: (r) => r.deviceId == "${deviceId}")`;

        console.log(fluxQuery);

        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                response.push(data);
            },
            error(error) {
                console.error('Error al leer los datos:', error);
                reject({ error: "Error al obtener datos de InfluxDB", details: error });
            },
            complete() {
                console.log('Consulta completada.');
                resolve(response);
            },
        });
    })
}