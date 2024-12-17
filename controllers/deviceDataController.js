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

            // parametros de configuracion influx 
            const token = process.env.TOKKEN_INFLUX_DB;
            const org = process.env.ORGANIZACION_INFLUX_DB;
            const bucket = req.body.bucketType;
            const device_uid = req.body.deviceId;
            const url = `${process.env.URL_DOMAIN_INDEX_INFLUX_QUERY}?bucket=${bucket}&org=${org}`;
            const influxDB = new InfluxDB({ url, token });
            const queryApi = influxDB.getQueryApi(org);
            const query_range = (req.body.dateStart === req.body.dateEnd) ? `|> range(start: -24h)` : `|> range(start: ${req.body.dateStart}, stop: ${req.body.dateEnd})`;
            const query_last = (req.body.dateStart !== req.body.dateEnd) ? `|> aggregateWindow(every: 1d, fn: mean, createEmpty: false)` : '';

            // validamos que tipo de device es quien pide los datos para obtener un modelo u otro
            if (req.body.queryType === 'solana') {
                // 29a71256cb3e82ed pro workspaceId
                const query_measurement = (req.body.workspaceId === '29a71256cb3e82ed') ? 'Solana PRO' : 'Solana PRE'
                const query_string_temperatura = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "temperatura")`;
                const query_string_humedad = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "humedad")`;
                const query_string_batteria = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "vBatt")`;
                const query_string_pannel = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "vPannel")`;
                const query_string_duration = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "duration")`;
                const query_string_deposito = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "agua")`;
                const query_string_puerta = `|> filter(fn: (r) => r._measurement == "${query_measurement}") |> filter(fn: (r) => r._field == "puerta")`;

                const dataTemperaturaSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_temperatura, query_last);
                const dataHumedadSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_humedad, query_last);
                const dataBatteriaSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_batteria, query_last);
                const dataPannelSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_pannel, query_last);
                const dataDurationSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_duration, query_last);
                const dataDepositoSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_deposito, query_last);
                const dataPuertaSolana = await fetchDataSolanaInflux(bucket, device_uid, queryApi, query_range, query_string_puerta, query_last);

                res.status(200).json(
                    {
                        temperatura: dataTemperaturaSolana,
                        humedad: dataHumedadSolana,
                        batteria: dataBatteriaSolana,
                        pannel: dataPannelSolana,
                        durattion: dataDurationSolana,
                        deposito: dataDepositoSolana,
                        puerta: dataPuertaSolana
                    }
                );

            } else if (req.body.queryType === 'franklin') {
                const query_string_temperatura = '|> filter(fn: (r) => r._field == "temperatura")';
                const query_string_humedad = '|> filter(fn: (r) => r._field == "humedad")';
                const query_string_co2 = '|> filter(fn: (r) => r._field == "co2")';
                const query_string_pm1 = '|> filter(fn: (r) => r._field == "pm1")';

                const dataTemperaturaFranklin = await fetchDataFranklinInflux(bucket, device_uid, queryApi, query_range, query_string_temperatura, query_last);
                const dataHumedadFranklin = await fetchDataFranklinInflux(bucket, device_uid, queryApi, query_range, query_string_humedad, query_last);
                const dataCo2Franklin = await fetchDataFranklinInflux(bucket, device_uid, queryApi, query_range, query_string_co2, query_last);
                const dataPm1Franklin = await fetchDataFranklinInflux(bucket, device_uid, queryApi, query_range, query_string_pm1, query_last);
                res.status(200).json(
                    {
                        temperatura: dataTemperaturaFranklin,
                        humedad: dataHumedadFranklin,
                        co2: dataCo2Franklin,
                        pm1: dataPm1Franklin
                    }
                );

            } else if (req.body.queryType === 'basic') {
                const query_string_temperatura = '|> filter(fn: (r) => r._measurement == "Basic") |> filter(fn: (r) => r._field == "temperatura")';
                const query_string_magnitud = '|> filter(fn: (r) => r._measurement == "Basic") |> filter(fn: (r) => r._field == "magnitude")';
                const dataBasicTemperatura = await fetchDataBasicInflux(bucket, device_uid, queryApi, query_range, query_string_temperatura, query_last);
                const dataBasicMagnitud = await fetchDataBasicInflux(bucket, device_uid, queryApi, query_range, query_string_magnitud, query_last);
                res.status(200).json(
                    {
                        temperatura: dataBasicTemperatura,
                        magnitud: dataBasicMagnitud
                    }
                );
            }

        } catch (error) {
            res.status(500).json({ message: 'Error al obtener datos del dispositivo.', error: error.message });
        }
    } else {
        res.status(403).json({ error: 'Token requerido' })
    }
}