import { InfluxDB } from '@influxdata/influxdb-client';
import { config } from 'dotenv';
import path from 'path';

// Cargar las variables de entorno
config({
    path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env.vars'),
});

// obtener datos de solana desde API/influx
export const fetchDataSolanaInflux = async (bucket, device_uid, queryApi, query_range, query_string, query_last) => {
    const response = [];
    return new Promise((resolve, reject) => {
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
    })
}

// obtener datos de franklin desde API/influx
export const fetchDataFranklinInflux = async (bucket, device_uid, queryApi, query_range, query_string, query_last) => {
    const response = [];
    return new Promise((resolve, reject) => {
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
    })
}

// obtener datos de basic desde API/influx
export const fetchDataBasicInflux = async (bucket, device_uid, queryApi, query_range, query_string, query_last) => {
    const response = [];
    return new Promise((resolve, reject) => {
        const fluxQuery = `
        from(bucket: "${bucket}")
        ${query_range}
        ${query_string}
        |> filter(fn: (r) => r.akenzaDeviceId == "${device_uid}")
        ${query_last}`;

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