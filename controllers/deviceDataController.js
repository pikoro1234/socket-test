import { InfluxDB } from '@influxdata/influxdb-client';
import { fetchDataModelDevices } from '../models/deviceDataModel.js';

export const getAllDataInflux = async (req, res) => {
    console.log(req.body);
    if (!req.header('Authorization')) { return res.status(403).json({ error: 'Token requerido' }) };

    try {
        if (!req.body.deviceId) { return res.status(404).json({ message: 'Device id Required' }); }
        if (!req.body.bucketType) { return res.status(404).json({ message: 'Bucket Required' }); }
        if (!req.body.queryType) { return res.status(404).json({ message: 'QueryType Required' }); }
        if (!req.body.querySet) { return res.status(404).json({ message: 'QuerySet Required' }); }

        // parametros de configuracion influx
        const token = process.env.TOKKEN_INFLUX_DB;
        const org = process.env.ORGANIZACION_INFLUX_DB;
        const url = `${process.env.URL_DOMAIN_INDEX_INFLUX_QUERY}?org=${org}`;
        const influxDB = new InfluxDB({ url, token });
        const queryApi = influxDB.getQueryApi(org);

        // params query
        const bucket = req.body.bucketType;
        const startDate = req.body.dateStart;
        const endDate = req.body.dateEnd;
        const querySet = req.body.querySet;
        const deviceId = req.body.deviceId;

        //queries strings / eject model
        const dataResponse = await fetchDataModelDevices(queryApi, bucket, startDate, endDate, querySet, deviceId);

        return res.status(200).json({ data: dataResponse })

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}