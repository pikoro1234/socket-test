import { InfluxDB } from '@influxdata/influxdb-client';
import { fetchDataSolanaInflux, fetchDataFranklinInflux, fetchDataBasicInflux } from '../models/deviceDataModel.js';

export const getAllDataInflux = async (req, res) => {
    if (req.header('Authorization')) {
        try {
            if (!req.body.deviceId) {
                res.status(404).json({ message: 'Device id Not Found' });
            }
            if (!req.body.bucketType) {
                res.status(404).json({ message: 'Buccket Not Found' });
            }
            if (!req.body.queryType) {
                res.status(404).json({ message: 'Query Not Support' });
            }

            console.log(req.body);
            // parametros de configuracion influx 
            const token = process.env.TOKKEN_INFLUX_DB;
            const org = process.env.ORGANIZACION_INFLUX_DB;
            const bucket = req.body.bucketType;
            const device_uid = req.body.deviceId;
            const url = `${process.env.URL_DOMAIN_INDEX_INFLUX_QUERY}?bucket=${bucket}&org=${org}`;
            const influxDB = new InfluxDB({ url, token });
            const queryApi = influxDB.getQueryApi(org);
            const query_range = `|> range(start: ${req.body.dateStart}, stop: ${req.body.dateEnd})`;
            const query_last = (req.body.dateStart !== '' && req.body.dateEnd !== '') ? '|> aggregateWindow(every: 1d, fn: mean, createEmpty: false)' : '|> last()';

            // validamos que tipo de device es quien pide los datos para obtener un modelo u otro
            if (req.body.queryType === 'solana') {
                const query_string = '|> filter(fn: (r) => r._measurement == "Solana PRO") |> filter(fn: (r) => r._field == "humedad" or r._field == "temperatura")';
                const dataSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string, query_last);
                res.status(200).json({ mensaje: dataSolana });

            } else if (req.body.queryType === 'franklin') {
                const query_string = '|> filter(fn: (r) => r._field == "temperatura" or r._field == "humedad" or r._field == "co2" or r._field == "pm1")';
                const dataFranklin = await fetchDataFranklinInflux(bucket, device_uid, queryApi, query_range, query_string, query_last);
                res.status(200).json({ mensaje: dataFranklin });

            } else if (req.body.queryType === 'basic') {
                const query_string = '|> filter(fn: (r) => r._measurement == "Basic") |> filter(fn: (r) => r._field == "magnitude" or r._field == "temperatura")';
                const dataBasic = await fetchDataBasicInflux(bucket, device_uid, queryApi, query_range, query_string, query_last);
                res.status(200).json({ mensaje: dataBasic });
            }

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener datos del dispositivo.', error: error.message });
        }
    } else {
        res.status(403).json({ error: 'Token requerido' })
    }
}