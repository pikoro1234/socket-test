import { insertFilesModel } from '../../models/urbidermis/urbidermisModel.js';

export const validateFiles = async (req, res) => {
    try {
        const { user_entorno, name_file, url_file, fecha_file, user_email_file, user_nick_file, user_ip_file, user_idioma } = req.body;

        // Validación simple de datos
        if (!user_entorno || !url_file || !name_file || !user_email_file || !user_nick_file || !user_ip_file || !user_idioma) {
            return res.status(400).json({ success: false, message: "❌ Faltan campos obligatorios" });
        }

        if (user_email_file !== 'No definido') {
            const response = await insertFilesModel(req.body);
            if (response.affectedRows >= 1) {
                return res.status(200).json({ success: true, message: "insercion correcta" })
            }
            return res.status(400).json({ success: false, message: "no se pudo insertar el fichero" })
        }

        return res.status(400).json({ success: false, message: "error insert" })

    } catch (error) {
        console.error("❌ Error al insertar datos:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
}