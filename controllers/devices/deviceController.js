import { getNoFilterWorkSpace } from '../../helpers/helperDevices.js';
import { getDevicesModel } from '../../models/devices/deviceModel.js';

export const getDevices = async (req, res) => {

    try {

        const workspaces = await getNoFilterWorkSpace();

        const devices = await getDevicesModel(workspaces)

        res.json(devices)

    } catch (error) {
        console.log(error);
    }
}

// export const fetchDevices = async (workspaceIds) => {
//     try {
//         const response = await fetch('https://api.akenza.io/v3/assets/list?size=50', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-api-key': process.env.X_API_KEY
//             },
//             body: JSON.stringify({
//                 organizationId: process.env.ID_ORGANIZACION,
//                 workspaceIds: workspaceIds
//             }),
//         })

//         if (!response.ok) { throw new Error(`Error con la API : ${response.statusText}`); }

//         return await response.json();

//     } catch (error) {
//         console.error('Error en fetchDevices:', error.message);
//         throw error;
//     }
// }


// export const getterAllDevices = async () => {
//     try {
//         const method = 'POST'
//         const endPoint = '/devices/all-devices-workspaces/'
//         const body = JSON.stringify({ workspaceIds: [ "29a71256cb3e82ed", "295f038c09806307", "292a1e5b1f960b80" ] })
//         const response = await fetchDevices(endPoint, body, method);
//         // console.log(response.devices.content);
//         return response.devices.content
//     } catch (error) {
//         console.log(error);
//     }
// }