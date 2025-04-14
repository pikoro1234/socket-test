import { deleteExpiredKeyCommTempUserModel } from '../../models/users/authModel.js';
import { getAllQueriesToDb } from '../../models/iA/iAModel.js';
import { chatAgentToClient } from '../../helpers/helperIa.js';


export const getProcessData = async (req, res) => {

    try {

        if (!req.body.prompt) return res.status(400).json({ success: false, message: "Bad Request..." })

        const topic_user = req.body.textcomm

        const response = await chatAgentToClient(req.user, topic_user, req.body.prompt);

        console.log(response);

        if (!response.success) {

            return res.status(404).json({ success: false, message: "Not found." })
        }

        return res.status(200).json({ success: true, message: response.data.response })

    } catch (error) {

        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error..." })
    }
}

export const validateExpireChat = async (req, res) => {

    try {

        if (!req.body.textcomm) return res.status(400).json({ success: false, message: "Bad Request." })

        const topic_user = req.body.textcomm;
        const response = await deleteExpiredKeyCommTempUserModel(topic_user);
        return res.status(200).json(response)

    } catch (error) {

        console.log(error);
    }
}