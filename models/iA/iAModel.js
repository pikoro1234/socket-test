import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const createQueryChatDb = async (dataUser, queryText, responseText) => {
    try {

        const query = "INSERT INTO `platform_queries`(`id_user_platform`, `rol_user_platform`, `query_user_platform`, `response_ia_agent`) VALUES (?,?,?,?)";
        const [ result ] = await pool_urbidata.query(query, [ dataUser.id, dataUser.role_id, queryText, responseText.response ]);
        return result.affectedRows;

    } catch (error) {

        console.log(error);
        return 0;
    }
}

export const getAllQueriesToDb = async () => {

    try {

        const query = "SELECT * FROM `platform_queries`";
        const [ result ] = await pool_urbidata.query(query);
        return result;

    } catch (error) {

        console.log(error);
    }
}