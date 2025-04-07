import { insertQueriesTrackingModel, getAllQueriesToDb } from '../../models/iA/iAModel.js';
import { chatAgentToClient } from '../../helpers/helperIa.js';

export const getProcessData = async (req, res) => {

    console.log(req.body);

    try {


        // if (req.apiAccess) {

        if (!req.body.prompt) {
            return res.status(400).json({ success: false, message: "Bad Request..." })
        }

        console.log(req.body.prompt);

        // const id_user = req.position_user
        // const id_rol = req.position_rol.role_id
        // const body_query = req.body.prompt


        // await chatAgentToClient(body_query)

        // insertamos la pregunta que se hizo en el formulario
        // await insertQueriesTrackingModel(id_user, id_rol, body_query);

        // obtenemos todas las queries que realizan los usuarios
        // const get_all_queries = await getAllQueriesToDb();

        // console.log(get_all_queries);


        // envio mqtt con datos de projectos y devices
        const send_data = {
            "prompt": req.body.prompt,
            "data": [
                {
                    "cliente_key": "girona",
                    "cliente_name": "Girona Ayto.",
                    "cliente_id": 1,
                    "devices": [
                        { "id": "JAT1001A", "id_reference": "02f8c787a749767a" },
                        { "id": "JAT1002A", "id_reference": "02a88271804a3bd4" }
                    ]
                },
                {
                    "cliente_key": "port-ginesta",
                    "cliente_name": "Port Ginesta",
                    "cliente_id": 2,
                    "devices": [
                        { "id": "JAT1003A", "id_reference": "02c4819a475fe4ca" },
                        { "id": "JAT1004A", "id_reference": "02ffd0d907664d07" }
                    ]
                },
                {
                    "cliente_key": "nautic-palamos",
                    "cliente_name": "Nautic Palamos SA",
                    "cliente_id": 3,
                    "devices": [
                        { "id": "JAT1005A", "id_reference": "02d5029c2216f2bf" },
                        { "id": "JAT1006A", "id_reference": "0254bc752b6acdf6" }
                    ]
                },
                {
                    "cliente_key": "la-roca-del-valles",
                    "cliente_name": "La Roca del Vallès",
                    "cliente_id": 4,
                    "devices": [
                        { "id": "JAT1007A", "id_reference": "02c9d061ff686311" },
                        { "id": "JAT1008A", "id_reference": "028443cf9667e55e" },
                        { "id": "JAT1009A", "id_reference": "0234ccc76a2782bb" }
                    ]
                }
            ]
        }

        const static_response = `{"response": "Aquí tienes el estado de tus jardineras \n- JAT1007A: Puerta cerrada (<a href=\"/mapas/02c9d061ff686311\">02c9d061ff686311</a>)\n- JAT1005A: Puerta cerrada (<a href=\"/mapas/02d5029c2216f2bf\">02d5029c2216f2bf</a>)\n- JAT1003A: Puerta cerrada (<a href=\"/mapas/02c4819a475fe4ca\">02c4819a475fe4ca</a>)\n- JAT1009A: Puerta cerrada (<a href=\"/mapas/0234ccc76a2782bb\">0234ccc76a2782bb</a>)\n- JAT1008A: Puerta cerrada (<a href=\"/mapas/028443cf9667e55e\">028443cf9667e55e</a>)\n- JAT1002A: Puerta abierta (<a href=\"/mapas/02a88271804a3bd4\">02a88271804a3bd4</a>)\n- JAT1004A: Puerta cerrada (<a href=\"/mapas/02ffd0d907664d07\">02ffd0d907664d07</a>)\n- JAT1006A: Puerta cerrada (<a href=\"/mapas/0254bc752b6acdf6\">0254bc752b6acdf6</a>)\n\nSi necesitas más información, no dudes en preguntar."}`

        return res.status(200).json({ success: true, message: static_response })
        // }

        // return res.status(401).json({ success: false, menssage: "no se pudo validad el token" })

    } catch (error) {

        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error..." })
    }
}