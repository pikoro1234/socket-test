import { insertQueriesTrackingModel, getAllQueriesToDb } from '../../models/iA/iAModel.js';
import { chatAgentToClient } from '../../helpers/helperIa.js';

export const getProcessData = async (req, res) => {

    try {

        if (!req.body.prompt) return res.status(400).json({ success: false, message: "Bad Request..." })

        const topic_user = req.body.textcomm

        const response = await chatAgentToClient(topic_user, req.body.prompt);

        if (response.status !== 'success') {

            return res.status(404).json({ success: false, message: "Not found." })
        }

        return res.status(200).json({ success: true, message: response.data.response })

    } catch (error) {

        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error..." })
    }
}