import { getNoFilterWorkSpace, filterCustomField } from '../../helpers/helperDevices.js';
import { getDevicesModel, importDevicesModel } from '../../models/devices/deviceModel.js';
import { customFetch } from '../../services/custom.js';
import { uri_primary } from '../../no-trackin.js';


export const getDevices = async (req, res) => {

    try {

        const workspaces = await getNoFilterWorkSpace();

        const devices = await getDevicesModel(workspaces);

        if (devices.data.content.length > 0) {

            const mappedDevices = devices.data.content.map(({ id, deviceId, name, description, customFields, created }) => {

                const coordenadas = filterCustomField(customFields, 'Coordenadas').GPS_COORDINATES;

                return {
                    id_device: deviceId,
                    id_reference: id,
                    type: name,
                    description: description,
                    coordenadas: coordenadas,
                    date_created: created
                };
            });

            return res.status(200).json(mappedDevices);
        }

        return res.status(404).json({ message: "Not found." });

    } catch (error) {
        console.log(error);
    }
}

export const importDevices = async (req, res) => {

    try {

        const method = 'GET'
        const uri = `${uri_primary}/devices/getter-devices/`
        const headers = { "Content-Type": "application/json", }
        const response = await customFetch(method, uri, headers, {})

        const insertDevicesDb = await importDevicesModel(response.data)

        if (insertDevicesDb > 0) {
            return res.status(200).json({ message: "Inserción completa" })
        }

        return res.status(503).json({ message: "Error en la inseción se borraron todos los datos" })

    } catch (error) {

        console.log(error);
        return res.status(503).json({ message: "Error en la inseción se borraron todos los datos try/catch" })
    }
}