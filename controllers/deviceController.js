import { fetchWorkspaces, fetchDevices, fetchDataDevice } from '../models/deviceModel.js';

export const getAllWorkspaces = async (req, res) => {
    try {
        const dataWorkspace = await fetchWorkspaces();

        res.status(200).json({ message: 'Listado de workspace completo.', dataWorkspace })

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos de los workspace.', error: error.message });
    }
}

export const getAllDevices = async (req, res) => {
    try {
        const workspaceIds = [ req.body.workspaceIds[ 0 ].id ]

        if (!workspaceIds) { return res.status(400).json({ message: 'workspaceIds es requerido' }); }

        const devices = await fetchDevices(workspaceIds);

        res.status(200).json({ message: 'Dispositivos obtenidos con éxito.', devices });

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener dispositivos.', error: error.message });
    }
}

export const getDataDevice = async (req, res) => {
    try {
        const deviceId = req.params.id

        if (!deviceId) { return res.status(400).json({ message: 'deviceId es requerido' }) }

        const dataDevice = await fetchDataDevice(deviceId);

        res.status(200).json({ message: 'Detalles del dispositivo completo.', dataDevice })

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener datos del dispositivo.', error: error.message });
    }
}