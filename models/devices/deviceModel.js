import { pool_urbidata } from '../../database/bd_urbicomm.js';
import { helperGetClientUser } from '../../helpers/helperUsers.js';
import { customFetch } from '../../services/custom.js';
import { uri_root_dashboard, header_api_key_extern, uri_get_assets_extern, organizacion_id_extern } from '../../no-trackin.js';

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

            query_devices = "SELECT * FROM devices";

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

                    const queryUpdate = 'UPDATE devices SET type=?, description=?, latitude=?, longitude=? WHERE id_device = ?';

                    const valuesUpdate = [
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
        const uri = `${uri_root_dashboard}/devices/by-device-id?deviceId=${id_device}`
        const result = await customFetch(method, uri, header_api_key_extern, {})

        if (result.success) {
            console.log(result.data)
            // const mappedDetails = devices.data.content.map(({ id, deviceId, name, description, customFields, created }) => {

            //     const coordenadas = filterCustomField(customFields, 'Coordenadas').GPS_COORDINATES;

            //     return {
            //         id_device: deviceId,
            //         id_reference: id,
            //         type: name,
            //         description: description,
            //         coordenadas: coordenadas,
            //         date_created: created
            //     };
            // });

            // console.log(mappedDetails);

            // return res.status(200).json(mappedDevices);
        }

        return result

        // console.log(result);

    } catch (error) {

        console.log(error);
    }


    // customFetch = async (method, uri, headers, body

}

// var request = require('request');
// var options = {
//     'method': 'GET',
//     'url': 'https://api.akenza.io/v3/devices/by-device-id?deviceId=J0003A',
//     'headers': {
//         'x-api-key': '3beff9bb15cd6dd7.06e97757-5b92-4967-9437-a0a949c43270'
//     }
// };

// // https://api.akenza.io/v3/devices/${deviceId}
// request(options, function (error, response) {
//     if (error) throw new Error(error);
//     console.log(response.body);
// });
