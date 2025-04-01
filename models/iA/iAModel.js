import { pool_urbidata } from '../../database/bd_urbicomm.js';

export const insertQueriesTrackingModel = async (id_user, id_rol, body_query) => {

    try {

        const query = "INSERT INTO `platform_queries`(`id_user_platform`, `rol_user_platform`, `query_user_platform`) VALUES (?,?,?)";
        const [ result ] = await pool_urbidata.query(query, [ id_user, id_rol, body_query ]);
        console.log(result.affectedRows);
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