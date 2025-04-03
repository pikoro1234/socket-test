import { InfluxDB } from '@influxdata/influxdb-client';
import { pool_urbidata } from '../../database/bd_urbicomm.js';
import { customFetch } from '../../services/custom.js';
import { helperGetClientUser } from '../../helpers/helperUsers.js';
import { formatDeviceData } from '../../helpers/helperDevices.js';
import { header_api_key_extern, uri_get_assets_extern, organizacion_id_extern, uri_root_dashboard, url, token, org } from '../../no-trackin.js';

export const getDevicesModel = async (idUser, idRol) => {

    try {

        let query_devices = ``;
        let params = [];

        if (idRol === 1) {

            query_devices = "SELECT * FROM devices";

        } else if (idRol === 2) {

            const { user_id, client_id } = await helperGetClientUser(idUser); // query my client

            if (client_id) {

                query_devices = `SELECT * FROM client_devices JOIN devices ON client_devices.device_id = devices.id_device WHERE client_devices.client_id = ?`;
                params = [ client_id ]
            }

        } else {

            const { user_id, client_id } = await helperGetClientUser(idUser); // query my client

            if (client_id) {

                query_devices = `SELECT * FROM client_devices JOIN devices ON client_devices.device_id = devices.id_device WHERE client_devices.client_id = ?`;
                params = [ client_id ]
            }
        }

        const [ result ] = await pool_urbidata.query(query_devices, params);

        return result;

    } catch (error) {

        console.log(error);
    }
}

export const getDevicesNoFilterModel = async (workspaces) => {

    try {

        const method = 'POST'
        const body = { "organizationId": organizacion_id_extern, "workspaceIds": workspaces, }
        const response = customFetch(method, uri_get_assets_extern, header_api_key_extern, body);
        return response;

    } catch (error) {

        console.log(error);
    }
}

export const importDevicesModel = async (data) => {

    let response = 0;

    try {

        for (const device of data) {

            try {

                const id_device = device.id_device;
                const id_reference = device.id_reference;
                const type = device.type;
                const description = device.description;
                const latitude = device.coordenadas ? device.coordenadas.latitude : '';
                const longitude = device.coordenadas ? device.coordenadas.longitude : '';
                const date_created = device.date_created;

                const [ resultExistDevice ] = await pool_urbidata.query(`SELECT * FROM devices WHERE id_device = ?`, [ id_device ])

                if (resultExistDevice[ 0 ]) {

                    const queryUpdate = 'UPDATE devices SET id_reference=?, type=?, description=?, latitude=?, longitude=? WHERE id_device = ?';

                    const valuesUpdate = [
                        id_reference,
                        type,
                        description,
                        latitude,
                        longitude,
                        id_device
                    ];

                    const [ resultUpdate ] = await pool_urbidata.query(queryUpdate, valuesUpdate);

                } else {

                    const queryInsert = `INSERT INTO devices (id_device, id_reference, type, description, latitude, longitude,date_created) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                    const valuesInsert = [
                        id_device,
                        id_reference,
                        type,
                        description,
                        latitude,
                        longitude,
                        date_created
                    ];

                    const [ resultInsert ] = await pool_urbidata.query(queryInsert, valuesInsert);
                }

                response = 1

            } catch (insertErr) {

                response = 0

                console.log(insertErr);
            }
        }

        return response;

    } catch (error) {

        console.error("Error general:", error);
        return 0;
    }
}

export const getMyDetailsDeviceModel = async (id_device) => {

    try {

        const method = 'GET'
        const uri = `${uri_root_dashboard}/devices/${id_device}`
        const result = await customFetch(method, uri, header_api_key_extern, {})

        console.log(result);

        if (!result.success) {

            return json({ message: "Not Found..." })
        }

        return result

    } catch (error) {

        console.log(error);
    }
}

export const getMyDataHistoricDeviceModel = async (id, environment, type, mode, start, end) => {

    try {

        const filterFieldsByType = {
            Solana: [ "humedad", "temperatura", "vBatt", "puerta", "agua", "duration" ],
            Franklin: [ "campo1", "campo2", "campo3" ],
            Basic: [ "campoX", "campoY" ],
        };

        const fields = filterFieldsByType[ type ] || [];

        const string_filter_avg = fields.length ? `|> filter(fn: (r) => ${fields.map(f => `r._field == "${f}"`).join(" or ")})` : "";

        const influxDB = new InfluxDB({ url, token });
        const queryApi = influxDB.getQueryApi(org);

        return new Promise((resolve, reject) => {
            const response = [];
            const fluxQuery =
                mode === "summary"
                    ? `from(bucket: "${environment}")
                    |> range(start: ${start}, stop: ${end}T23:50:00Z)
                    |> filter(fn: (r) => r._measurement != "traces")
                    |> filter(fn: (r) => r.akenzaDeviceId == "${id}")
                    ${string_filter_avg}
                    |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
                    |> sort(columns: ["_time"], desc: false)`
                    : `from(bucket: "${environment}")
                    |> range(start: ${start}, stop: ${end}T23:50:00Z)
                    |> filter(fn: (r) => r._measurement != "traces")
                    |> filter(fn: (r) => r.akenzaDeviceId == "${id}")
                    |> sort(columns: ["_time"], desc: false)`;

            // print query debug
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
                    // console.log(response);
                    const formattedData = formatDeviceData(type, mode, response);
                    console.log(formattedData);
                    resolve(formattedData);
                    // resolve(response);
                },
            });
        });

    } catch (error) {
        console.log(error);
    }
}