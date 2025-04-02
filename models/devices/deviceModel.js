import { pool_urbidata } from '../../database/bd_urbicomm.js';
import { helperGetClientUser } from '../../helpers/helperUsers.js';
import { customFetch } from '../../services/custom.js';
import { header_api_key_extern, uri_get_assets_extern, organizacion_id_extern, uri_root_dashboard } from '../../no-trackin.js';

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
};

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