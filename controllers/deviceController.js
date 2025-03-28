import { fetchDevices, fetchDataDevice } from '../models/deviceModel.js';
// import { configUpdateSolana } from '../services/putDataDevices.js';

// export const getAllDevices = async (req, res) => {
//     try {
//         const workspaceIds = [ req.body.workspaceIds[ 0 ].id ]

//         if (!workspaceIds) { return res.status(400).json({ message: 'workspaceIds es requerido' }); }

//         const devices = await fetchDevices(workspaceIds);

//         res.status(200).json({ message: 'Dispositivos obtenidos con éxito.', devices });

//     } catch (error) {

//         res.status(500).json({ message: 'Error al obtener dispositivos.', error: error.message });
//     }
// }

// export const postDataDevice = async (req, res) => {
//     try {

//         if (!req.header('Authorization')) { return res.status(403).json({ error: 'Token requerido' }) };

//         if (req.body.type === 'solana') {

//             const response = await configUpdateSolana(req.body)

//             if (response.status === 200) {

//                 console.log({ message: 'update correct' });

//                 return res.status(200).json({ message: 'update correct' })
//             }

//             console.log({ message: 'update error' });

//             return res.status(500).json({ message: 'update error' })
//         }

//     } catch (error) {

//         res.status(500).json({ message: 'Error al actualizar el dispositivo.', error: error.message });
//     }
// }

// borrar al desplegar
export const getDataDevice = async (req, res) => {
    try {
        const deviceId = req.params.id

        if (!deviceId) { return res.status(400).json({ message: 'deviceId es requerido' }) }

        const dataDevice = await fetchDataDevice(deviceId);

        res.status(200).json({ message: 'Detalles del dispositivo completo.', dataDevice })

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del dispositivos.', error: error.message });
    }
}

// export const getAllDevicesNoFilter = async (req, res) => {
//     try {
//         const workspaceIds = req.body.workspaceIds

//         const devices = await fetchDevices(workspaceIds);

//         console.log(devices);

//         res.status(200).json({ message: 'Todos los dispositivos.', devices });

//     } catch (error) {
//         res.status(500).json({ message: 'Error al obtener todos los dispositivos.', error: error.message });
//     }
// }