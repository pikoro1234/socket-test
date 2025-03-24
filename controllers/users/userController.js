import { getUserDataModel } from "../../models/users/userModel.js";

export const getUserData = async (req, res) => {
    try {

        const userId = req.user.id;

        if (!userId) {
            res.status(401).json({ message: "User no autorizado." });
        }

        const response = await getUserDataModel(userId);

        if (response === null) {
            return res.status(404).json({ message: "Not found" })
        }

        return res.status(200).json({ message: response })

    } catch (error) {
        console.log(error);
    }
}