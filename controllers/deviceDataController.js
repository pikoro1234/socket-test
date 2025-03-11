import { InfluxDB } from '@influxdata/influxdb-client';
import { fetchDataModelDevices } from '../models/deviceDataModel.js';
import { convert_data_solana, convert_data_basic, convert_data_franklin } from '../services/functionsGenerics.js';
import { sendMqttPrompt } from '../services/sendMqttGeneric.js';

export const getAllDataInflux = async (req, res) => {

    if (!req.header('Authorization')) { return res.status(403).json({ error: 'Token requerido' }) };

    try {
        // validacion de params
        if (!req.body.deviceId) { return res.status(404).json({ message: 'Device id Required' }); }
        if (!req.body.bucketType) { return res.status(404).json({ message: 'Bucket Required' }); }
        if (!req.body.queryType) { return res.status(404).json({ message: 'QueryType Required' }); }

        // parametros de configuracion influx
        const token = process.env.TOKKEN_INFLUX_DB;
        const org = process.env.ORGANIZACION_INFLUX_DB;
        const url = `${process.env.URL_DOMAIN_INDEX_INFLUX_QUERY}?org=${org}`;
        const influxDB = new InfluxDB({ url, token });
        const queryApi = influxDB.getQueryApi(org);

        // params query
        const bucket = req.body.bucketType;
        const deviceId = req.body.deviceId;
        const queryType = req.body.queryType;
        const startDate = req.body.dateStart;
        const endDate = req.body.dateEnd;

        //queries strings / eject model
        const dataResponse = await fetchDataModelDevices(queryApi, bucket, startDate, endDate, deviceId);

        // traducimos respuesta para devolver al front transformado Solana/Basic/Franklin
        if (queryType === 'Solana') {

            return res.status(200).json(convert_data_solana(dataResponse))

        } else if (queryType === 'Basic') {

            return res.status(200).json(convert_data_basic(dataResponse))

        } else {

            return res.status(200).json(convert_data_franklin(dataResponse))
        }

    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const getResponseIa = async (req, res) => {
    const { prompt } = req.body;
    try {

        if (prompt === '') return res.status(400).json({ status: "error", message: "text required" })

        const response = await sendMqttPrompt(prompt);

        return res.json(response);

    } catch (error) {

        console.log("entramos al catch");
        return res.status(500).json({ status: "error", message: error });
    }
}