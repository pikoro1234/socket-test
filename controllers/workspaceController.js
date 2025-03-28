// import { fetchWorkspaces } from '../models/workspaceModel.js';

// export const getAllWorkspaces = async (req, res) => {
//     try {
//         const dataWorkspace = await fetchWorkspaces();

//         return res.status(200).json({ message: 'Listado de workspace completo.', dataWorkspace })

//     } catch (error) {
//         return res.status(500).json({ message: 'Error al obtener datos de los workspace.', error: error.message });
//     }
// }