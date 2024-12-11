import { fetchDataInflux } from '../models/deviceDataModel.js';

export const getAllDataInflux = async (req, res) => {
    if (req.header('Authorization')) {
        try {
            if (!req.body.deviceId) {
                res.status(404).json({ message: 'Device id Not Found' });
            }
            if (!req.body.bucketType) {
                res.status(404).json({ message: 'Buccket Not Found' });
            }
            if (!req.body.queryType) {
                res.status(404).json({ message: 'Query Not Support' });
            }

            const dataWorkspace = await fetchDataInflux(req.body);

            res.json({ mensaje: dataWorkspace });
            
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener datos de los workspace.', error: error.message });
        }
    } else {
        res.status(403).json({ error: 'Token requerido' })
    }
}