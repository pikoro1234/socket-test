import { getUserDataModel, getUserProjectsModel } from '../../models/users/userModel.js';

export const getUserData = async (req, res) => {

    try {

        const userId = req.apiAccess ? req.position_user : req.user.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User no autorizado." });
        }

        const response = await getUserDataModel(userId);

        console.log(response);

        if (response === null) {

            return res.status(404).json({ success: false, message: "Not found" })
        }

        return res.status(200).json({ success: true, message: response })

    } catch (error) {
        console.log(error);
    }
}

export const getUserProjects = async (req, res) => {

    try {

        const userId = req.apiAccess !== undefined ? req.position_user : req.user.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User no autorizado." });
        }

        const response = await getUserProjectsModel(req);

        if (response.length === 0) {

            return res.status(404).json({ success: false, message: "Not found" });
        }

        return res.status(200).json({ success: true, message: response });

    } catch (error) {
        console.log(error);
    }

}