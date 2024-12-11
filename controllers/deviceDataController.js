import { fetchWorkspaces, fetchDevices, fetchDataDevice } from '../models/deviceModel.js';

export const getAllDataInflux = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.deviceId) {
            res.status(404).json({ message: 'Device id Not Found' });
        }
        if (!req.body.bucketType) {
            res.status(404).json({ message: 'Buccket Not Found' });
        }
        if (!req.body.queryType) {
            res.status(404).json({ message: 'Query Not Support' });
        }

        // const data
        // res.json({ mensaje: "response controlador" });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos de los workspace.', error: error.message });
    }
}

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