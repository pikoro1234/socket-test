import { InfluxDB } from '@influxdata/influxdb-client';
import { config } from 'dotenv';
import path from 'path';

// Cargar las variables de entorno
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env.vars'),
});

// mostrar todos los datos --> Desde API/influx
export const fetchDataInflux = async (objRequest) => {
    return new Promise((resolve, reject) => {
        let query_string = '';
        let query_range = '|> range(start: -1h)';
        let query_last = '|> last()';
        let query_average = '|> aggregateWindow(every: 1d, fn: mean, createEmpty: false)';
        const response = [];
        const token = process.env.TOKKEN_INFLUX_DB;
        const org = process.env.ORGANIZACION_INFLUX_DB;
        const bucket = objRequest.bucketType;
        const device_uid = objRequest.deviceId;
        const queryType = objRequest.queryType;
        const url = `${process.env.URL_DOMAIN_INDEX_INFLUX_QUERY}?bucket=${bucket}&org=${org}`;
        const influxDB = new InfluxDB({ url, token });
        const queryApi = influxDB.getQueryApi(org);

        if (queryType === 'franklin') {
            query_string = '|> filter(fn: (r) => r._field == "temperatura" or r._field == "humedad" or r._field == "co2" or r._field == "pm1")';
        } else if (queryType === 'solana') {
            query_range = '|> range(start: -30d)';
            query_string = '|> filter(fn: (r) => r._measurement == "Solana PRO") |> filter(fn: (r) => r._field == "humedad" or r._field == "temperatura")';
        } else if (queryType === 'basic') {
            query_range = '|> range(start: -1d)';
            query_string = '|> filter(fn: (r) => r._measurement == "Basic") |> filter(fn: (r) => r._field == "magnitude" or r._field == "temperatura")';
        }

        if (objRequest.dateStart !== '' && objRequest.dateEnd !== '') {
            query_range = `|> range(start: ${(Math.floor(new Date(objRequest.dateStart).getTime() / 1000))}, stop: ${(Math.floor(new Date(objRequest.dateEnd).getTime() / 1000))})`;
            query_last = '';
        }

        const fluxQuery = `
            from(bucket: "${bucket}")
            ${query_range}
            ${query_string}
            |> filter(fn: (r) => r.akenzaDeviceId == "${device_uid}")
            ${query_last}`;

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
    });
};