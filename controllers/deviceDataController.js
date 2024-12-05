import { fetchWorkspaces, fetchDevices, fetchDataDevice } from '../models/deviceModel.js';

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