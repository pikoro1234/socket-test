import { createProjectDataModel, getProjectDataModel } from '../../models/projects/projectModel.js';

export const createProjectData = async (req, res) => {

    try {

        const { identificador, nombre, pais, ciudad, direccion } = req.body

        if (!identificador || !nombre || !pais || !ciudad || !direccion) {

            return res.status(400).json({ success: false, message: "Bad Request" })
        }

        const response = await createProjectDataModel(req.body);

        if (response > 0) {

            return res.status(200).json({ success: true, message: "proyecto creado correctamente" })
        }

        return res.status(304).json({ success: false, message: "Not Modified" })

    } catch (error) {

        console.log(error);
    }
}

export const getProjectData = async (req, res) => {

    try {

        const { id } = req.params;

        const userId = req.apiAccess ? req.position_user : req.user.id

        const rolUser = req.apiAccess ? req.position_rol.role_id : req.user.role_id

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        if (!userId) {
            return res.status(403).json({ success: false, message: "Token inválido" });
        }

        const response = await getProjectDataModel(id, rolUser);

        return res.status(200).json({ success: true, message: response })

    } catch (error) {
        console.log(error);
    }
}