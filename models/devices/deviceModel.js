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

                const query = `
                INSERT INTO devices (id_device, id_reference, type, description, latitude, longitude, date_created)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    id_reference = VALUES(id_reference),
                    type = VALUES(type),
                    description = VALUES(description),
                    latitude = VALUES(latitude),
                    longitude = VALUES(longitude)
                `;

                const values = [
                    id_device,
                    id_reference,
                    type,
                    description,
                    latitude,
                    longitude,
                    date_created
                ];

                await pool_urbidata.query(query, values);

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

        let measurement_permissions = '|> filter(fn: (r) => r._measurement != "traces" and r._measurement != "canceled_irrigations")';

        if (type === 'Basic') measurement_permissions = '|> filter(fn: (r) => r._measurement == "charger1" or r._measurement == "charger2" or r._measurement == "charger3" or r._measurement == "status_impact" or r._measurement == "status_temp")';

        if (type === 'Franklin') measurement_permissions = '|> filter(fn: (r) => r._measurement == "airquality" or r.measurement == "sensors_data")'

        const filterFieldsByType = {
            Solana: [ "humedad", "temperatura", "vBatt", "puerta", "agua", "duration" ],
            Basic: [ "power1", "power2", "power3", "magnitude", "temperatura" ],
            Franklin: [ "pm1", "pm2", "pm4", "pm10", "temperatura", "humedad", "co2", "nox", "voc", "ina219_current", "ina219_power", "ina260_current", "ina260_power" ],
        };

        const fields = filterFieldsByType[ type ] || [];
        const string_filter_avg = fields.length ? `|> filter(fn: (r) => ${fields.map(f => `r._field == "${f}"`).join(" or ")})` : "";

        const influxDB = new InfluxDB({ url, token });
        const queryApi = influxDB.getQueryApi(org);

        return new Promise((resolve, reject) => {
            const response = [];

            let fluxQuery = `from(bucket: "${environment}")
                    |> range(start: ${start}, stop: ${end}T23:50:00Z)
                    ${measurement_permissions}
                    |> filter(fn: (r) => r.akenzaDeviceId == "${id}")
                    ${string_filter_avg}
                    |> sort(columns: ["_time"], desc: false)`;

            if (mode === 'summary') {

                fluxQuery = `from(bucket: "${environment}")
                    |> range(start: ${start}, stop: ${end}T23:50:00Z)
                    ${measurement_permissions}
                    |> filter(fn: (r) => r.akenzaDeviceId == "${id}")
                    ${string_filter_avg}
                    |> aggregateWindow(every: 1d, fn: mean, createEmpty: false)
                    |> sort(columns: ["_time"], desc: false)`;
            }

            if (mode === 'last') {
                fluxQuery = `from(bucket: "${environment}")
                    |> range(start: ${start}, stop: ${end}T23:50:00Z)
                    ${measurement_permissions}
                    |> filter(fn: (r) => r.akenzaDeviceId == "${id}")
                    ${string_filter_avg}
                    |> last()`;
            }

            console.log(fluxQuery); // print query debug

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

                    const formattedData = formatDeviceData(type, response);
                    console.log(formattedData);
                    resolve(formattedData);
                },
            });
        });

    } catch (error) {
        console.log(error);
    }
}

export const getAllNoticesModel = async (devices) => {

    try {

        const allNotices = [];

        for (const device of devices) {
            const query = "SELECT * FROM `devices_warnings` WHERE id_device = ?";
            const [ result ] = await pool_urbidata.query(query, [ device.id_device ]);
            const mapped_obj = result.map(notice => ({
                id_table_notice: notice.id,
                id_notice: notice.id_warning,
                id_device_notice: notice.id_device,
                type_notice: notice.type_warning,
                state_notice: notice.state,
                timestamp_notice: notice.date_device,
                date_notice: notice.date
            }));

            allNotices.push(...mapped_obj);
        }

        return allNotices;

    } catch (error) {

        console.log(error);
    }
}