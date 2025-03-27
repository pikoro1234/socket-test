import { pool_urbidata } from '../../database/bd_urbicomm.js';
import { header_api_key_extern, uri_get_assets_extern, organizacion_id_extern } from '../../no-trackin.js';
import { customFetch } from '../../services/custom.js';

export const getDevicesModel = async (workspaces) => {

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

    const response = {
        inserted: 0,
        errors: []
    }

    try {

        const [ queryDelete ] = await pool_urbidata.query(`DELETE FROM devices`);

        for (const device of data) {

            try {

                const queryInsert = `INSERT INTO devices (id_device, id_reference, type, description, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)`;

                const values = [
                    device.id_device,
                    device.id_reference,
                    device.type,
                    device.description,
                    device.coordenadas ? device.coordenadas.latitude : '',
                    device.coordenadas ? device.coordenadas.longitude : '',
                ];

                const [ result ] = await pool_urbidata.query(queryInsert, values);

                if (result.affectedRows > 0) {

                    response.inserted += 1;

                } else {

                    response.errors.push({ device, message: "No se insertó" });
                }

            } catch (insertErr) {

                response.errors.push({ device, message: insertErr.message });
            }
        }

        return response;

    } catch (error) {

        console.error("Error general:", error);
        return {
            inserted: 0,
            errors: [ { message: error.message } ],
        };
    }
};